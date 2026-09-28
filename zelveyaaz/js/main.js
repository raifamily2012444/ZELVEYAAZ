/* =====================================================================
   ZELVEYAAZ — main.js
   Slideshow · Product cards · Functional cart · WhatsApp ordering
   ===================================================================== */
(() => {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  const fmt = (n) => STORE.currency + " " + n.toLocaleString("en-PK");

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------------- Hero slideshow ---------------- */
  const hero = {
    slides: $$(".hero-slide"),
    dotsBox: $("#heroDots"),
    index: 0,
    timer: null,
    duration: 5200,
    go(i) {
      this.slides[this.index].classList.remove("active");
      this.dots[this.index].classList.remove("active");
      this.index = (i + this.slides.length) % this.slides.length;
      this.slides[this.index].classList.add("active");
      this.dots[this.index].classList.add("active");
    },
    next() { this.go(this.index + 1); },
    prev() { this.go(this.index - 1); },
    start() {
      this.timer = setInterval(() => this.next(), this.duration);
      this.slides.forEach(s => {
        s.addEventListener("mouseenter", () => clearInterval(this.timer));
        s.addEventListener("mouseleave", () => { if (!hero.paused) hero.start(); });
      });
      const reset = () => {
        this.paused = true;
        clearInterval(this.timer);
        setTimeout(() => { this.paused = false; this.start(); }, 200);
      };
      this.slides.forEach(s => s.addEventListener("touchstart", reset));
    }
  };
  hero.dots = hero.slides.map((s, i) => {
    const d = document.createElement("button");
    d.className = "hero-dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", "Go to slide " + (i + 1));
    d.addEventListener("click", () => { clearInterval(hero.timer); hero.go(i); hero.start(); });
    hero.dotsBox.appendChild(d);
    return d;
  });
  $("#heroPrev").addEventListener("click", () => { clearInterval(hero.timer); hero.prev(); hero.start(); });
  $("#heroNext").addEventListener("click", () => { clearInterval(hero.timer); hero.next(); hero.start(); });
  hero.start();

  /* ---------------- Render product cards ---------------- */
  const grids = $$("[data-category]");
  const inCartIds = new Set();

  function cardHTML(p) {
    const badge = p.badge
      ? `<span class="card-badge ${p.badge === "Sale" ? "sale" : p.badge === "New" ? "new" : ""}">${p.badge}</span>`
      : "";
    const old = p.oldPrice ? `<span class="card-old">${fmt(p.oldPrice)}</span>` : "";
    const swatches = p.colors.map(c => `<span style="background:${c}"></span>`).join("");
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="card-media">
          ${badge}
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          <button class="card-quick" data-add="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l1.5 13.5a1.8 1.8 0 0 1-1.8 2H6.3a1.8 1.8 0 0 1-1.8-2L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>
            <span class="card-quick-label">Add to Bag</span>
          </button>
        </div>
        <div class="card-body">
          <p class="card-cat">${p.category === "unstitched" ? "Unstitched" : "Ready to Wear"}</p>
          <h3 class="card-name">${p.name}</h3>
          <div class="card-prices">
            <span class="card-price">${fmt(p.price)}</span>
            ${old}
          </div>
          <div class="card-swatch">${swatches}</div>
        </div>
      </article>`;
  }

  grids.forEach(grid => {
    const cat = grid.dataset.category;
    const items = PRODUCTS.filter(p => p.category === cat);

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-note">
          <p>Fresh styles arriving soon</p>
          <a href="#contact">Book yours early on WhatsApp →</a>
        </div>`;
      return;
    }

    grid.innerHTML = items.map(cardHTML).join("");
  });

  // Fallback image if a remote placeholder fails to load
  $$(".card-media img").forEach(img => {
    img.addEventListener("error", () => {
      img.src = "https://picsum.photos/seed/zelveyaaz" + img.parentElement.parentElement.dataset.id + "/600/800";
    });
  });

  /* ---------------- Cart state ---------------- */
  let cart = JSON.parse(localStorage.getItem("zelveyaaz_cart") || "[]");
  const qtyOf = (id) => cart.find(i => i.id === id)?.qty || 0;

  function saveCart() {
    localStorage.setItem("zelveyaaz_cart", JSON.stringify(cart));
    renderCart();
  }

  function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart();
    toast(`${p.name} added to your bag`);
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
  }

  function removeFromCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    if (p) toast(`${p.name} removed from bag`);
  }

  /* ---------------- Cart UI ---------------- */
  const drawer = $("#cartDrawer");
  const overlay = $("#cartOverlay");
  const itemsBox = $("#cartItems");
  const countEl = $("#cartCount");
  const subtotalEl = $("#cartSubtotal");

  function openCart() { drawer.classList.add("open"); overlay.classList.add("show"); document.body.style.overflow = "hidden"; }
  function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("show"); document.body.style.overflow = ""; }

  $("#cartButton").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  function renderCart() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = totalItems;

    $$(".card-quick").forEach(btn => {
      const id = Number(btn.dataset.add);
      const inCart = qtyOf(id) > 0;
      btn.classList.toggle("in-cart", inCart);
      btn.querySelector(".card-quick-label").textContent = inCart ? "In Bag" : "Add to Bag";
    });

    if (!cart.length) {
      itemsBox.innerHTML = `<div class="cart-empty">Your bag is empty.<br />Add something beautiful!</div>`;
      subtotalEl.textContent = "₨ 0";
      return;
    }

    itemsBox.innerHTML = cart.map(({ id, qty }) => {
      const p = PRODUCTS.find(x => x.id === id);
      return `
        <div class="cart-item" data-id="${id}">
          <img src="${p.img}" alt="${p.name}" />
          <div class="ci-info">
            <h4>${p.name}</h4>
            <p class="ci-cat">${p.category === "unstitched" ? "Unstitched" : "Ready to Wear"}</p>
            <p class="ci-price">${fmt(p.price)} × ${qty}</p>
            <div class="ci-controls">
              <div class="ci-qty">
                <button data-dec="${id}" aria-label="Decrease">−</button>
                <span>${qty}</span>
                <button data-inc="${id}" aria-label="Increase">+</button>
              </div>
            </div>
          </div>
          <button class="ci-remove" data-del="${id}" aria-label="Remove">&times;</button>
        </div>`;
    }).join("");

    subtotalEl.textContent = fmt(cart.reduce((s, i) => {
      const p = PRODUCTS.find(x => x.id === i.id);
      return s + p.price * i.qty;
    }, 0));

    $$(".ci-qty button", itemsBox).forEach(btn => {
      btn.addEventListener("click", () => changeQty(Number(btn.dataset.inc || btn.dataset.dec), btn.dataset.inc ? 1 : -1));
    });
    $$(".ci-remove", itemsBox).forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.del)));
    });
  }

  /* ---------------- WhatsApp checkout ---------------- */
  function waLink(text) {
    return `https://wa.me/${STORE.phone}?text=${encodeURIComponent(text)}`;
  }

  $("#cartCheckout").addEventListener("click", () => {
    if (!cart.length) { toast("Your bag is empty"); return; }
    const lines = cart.map(({ id, qty }) => {
      const p = PRODUCTS.find(x => x.id === id);
      const detail = `• ${p.name} (${p.category === "unstitched" ? "Unstitched" : "Ready to Wear"})`;
      const amount = `${qty} × ${fmt(p.price)} = ${fmt(p.price * qty)}`;
      return `${detail}\n   ${amount}\n`;
    }).join("\n");
    const total = cart.reduce((s, i) => s + PRODUCTS.find(x => x.id === i.id).price * i.qty, 0);
    const msg = `Hello Zelveyaz!\n\nI would like to order:\n\n${lines}\nSubtotal: ${fmt(total)}\n\nPlease confirm availability, delivery and payment.`;

    window.open(waLink(msg), "_blank", "noopener");
    closeCart();
  });

  $("#cartClear").addEventListener("click", () => {
    if (!cart.length) return;
    cart = [];
    saveCart();
    toast("Bag cleared");
  });

  /* ---------------- Add to cart (delegated) ---------------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (btn) addToCart(Number(btn.dataset.add));
  });

  /* ---------------- Quick order form ----------------
     Sends a full order via WhatsApp using STORE.phone. */
  $("#orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#ofName").value.trim();
    const items = $("#ofItems").value.trim();
    const city = $("#ofCity").value.trim();
    const note = $("#ofNote").value.trim();
    const msg =
      `Hello Zelveyaz!\n\nNAME: ${name}\nCITY: ${city}\n\nITEMS I LIKE:\n${items}` +
      (note ? `\n\nNOTES: ${note}` : "") +
      `\n\nPlease confirm availability and delivery.`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  $("#waCall").addEventListener("click", (e) => {
    e.preventDefault();
    window.open(waLink("Hello Zelveyaz! I have a question."), "_blank", "noopener");
  });

  /* ---------------- Newsletter ---------------- */
  $("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Thank you! You're on the list");
    e.target.reset();
  });

  /* ---------------- Mobile nav ---------------- */
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    mainNav.classList.toggle("open");
  });
  $$(".nav-link", mainNav).forEach(link =>
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      mainNav.classList.remove("open");
    })
  );

  /* ---------------- Header scroll + active link ---------------- */
  const header = $("#siteHeader");
  const sections = ["home", "unstitched", "ready-to-wear", "contact"];

  function setActive() {
    const y = window.scrollY + 160;
    let current = "home";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = id;
    });
    $$(".nav-link").forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    setActive();
  }, { passive: true });
  setActive();

  /* ---------------- Init ---------------- */
  renderCart();
})();
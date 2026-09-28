/* =====================================================================
   ZELVEYAAZ — PRODUCT CATALOG
   ---------------------------------------------------------------------
   Leave PRODUCTS empty to keep the sections blank until you add
   your own products. The site will show "Coming soon" placeholders.

   HOW TO ADD A PRODUCT:
   1) Put your photos inside the "images" folder.
      Example:  images/gulnaz.jpg
   2) Copy the example block below into the PRODUCTS array, edit the
      values, then save this file and refresh the page.
   ===================================================================== */

const PRODUCTS = [
  /* =================== COPY THIS TO ADD A PRODUCT ===================
  {
    id: 100,                         // unique number
    name: "Your Product Name",
    category: "unstitched",         // "unstitched" or "ready-to-wear"
    price: 9850,                    // PKR
    oldPrice: null,                 // set a number for a sale strike-through
    badge: "New",                   // "New", "Sale", "Bestseller", or null
    colors: ["#b98b2f", "#123a2c"], // any hex colors for the swatch dots
    img: "images/your-photo.jpg"    // your photo in the images folder
  },
  ===================================================================== */

  /* ---------------- Italian Wash & Wear unstitched suit --------------
     Micro fibre wash & wear, Boski base. 4 meter suit with 52-54 inch
     width, metallic buttons, brand inlays, tags and ribbon.
     One card per shade. Source photos: images/shades/
  ------------------------------------------------------------------ */
  { id: 1,  name: "Wash & Wear Suit — Mauve",        category: "unstitched", price: 4799, oldPrice: null, badge: "New",       colors: ["#a2758a"], img: "images/shades/shade-01.jpg" },
  { id: 2,  name: "Wash & Wear Suit — Slate Blue",   category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#9098b2"], img: "images/shades/shade-02.jpg" },
  { id: 3,  name: "Wash & Wear Suit — Sage Grey",    category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#a9a897"], img: "images/shades/shade-03.jpg" },
  { id: 4,  name: "Wash & Wear Suit — Teal",         category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#6f9290"], img: "images/shades/shade-04.jpg" },
  { id: 5,  name: "Wash & Wear Suit — Silver Grey",  category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#c9c9c9"], img: "images/shades/shade-05.jpg" },
  { id: 6,  name: "Wash & Wear Suit — Powder Blue",  category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#a6b0cb"], img: "images/shades/shade-06.jpg" },
  { id: 7,  name: "Wash & Wear Suit — Cornflower",   category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#6b97d0"], img: "images/shades/shade-07.jpg" },
  { id: 8,  name: "Wash & Wear Suit — Olive",        category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#a5ac97"], img: "images/shades/shade-08.jpg" },
  { id: 9,  name: "Wash & Wear Suit — Camel Tan",    category: "unstitched", price: 4799, oldPrice: null, badge: "Bestseller", colors: ["#875418"], img: "images/shades/shade-09.jpg" },
  { id: 10, name: "Wash & Wear Suit — Sand Beige",   category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#b29c86"], img: "images/shades/shade-10.jpg" },
  { id: 11, name: "Wash & Wear Suit — Lavender",     category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#928bad"], img: "images/shades/shade-11.jpg" },
  { id: 12, name: "Wash & Wear Suit — Steel Blue",   category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#8a9ba6"], img: "images/shades/shade-12.jpg" },
  { id: 13, name: "Wash & Wear Suit — Khaki",        category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#b4b092"], img: "images/shades/shade-13.jpg" },
  { id: 14, name: "Wash & Wear Suit — Ice Blue",     category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#d0d7e8"], img: "images/shades/shade-14.jpg" },
  { id: 15, name: "Wash & Wear Suit — Dusty Rose",   category: "unstitched", price: 4799, oldPrice: null, badge: null,         colors: ["#b09ca6"], img: "images/shades/shade-15.jpg" }
];

/* =====================================================================
   YOUR STORE DEFAULTS (edit these)
   ===================================================================== */
const STORE = {
  phone: "923000000000",      // WhatsApp number with country code, no "+"
  phoneDisplay: "+92 300 0000000",
  freeShippingOver: 5000,     // PKR threshold for the free-shipping note
  currency: "₨"
};

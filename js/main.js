/* Cabin Rose Station - interaksi ringkas: i18n BM/EN, nav mudah alih, reveal */

(function () {
  "use strict";

  /* ---------- Kamus dwibahasa ---------- */
  var I18N = {
    ms: {
      "nav.menu": "Menu",
      "nav.ambience": "Suasana",
      "nav.reviews": "Ulasan",
      "nav.location": "Lokasi",
      "hero.eyebrow": "River Front, Kemaman",
      "hero.title": "Cabin Rose Station",
      "hero.sub": "Corndog panas, nasi buttermilk dan western klasik di tepi Sungai Kemaman. Buka setiap hari sampai 11 malam.",
      "hero.cta1": "Tempah Sekarang",
      "hero.cta2": "Lihat Menu",
      "bar.daily": "Buka setiap hari",
      "bar.dailyHours": "11:00 pagi - 11:00 malam",
      "bar.fri": "Jumaat",
      "bar.friHours": "3:00 petang - 11:00 malam",
      "bar.call": "013-964 2739",
      "menu.title": "Yang wajib cuba",
      "menu.i1.tag": "Paling laris",
      "menu.i1.name": "Corndog Signature",
      "menu.i1.desc": "Rangup di luar, cheese melt di dalam. Sebab utama orang datang semula.",
      "menu.i2.name": "Nasi Buttermilk",
      "menu.i2.desc": "Ayam crispy bersalut sos buttermilk yang lemak dan manis.",
      "menu.i3.name": "Chicken Chop & Grill",
      "menu.i3.desc": "Western klasik, dimasak segar dengan sos homemade.",
      "menu.i4.name": "Kopi & Dessert",
      "menu.i4.desc": "Kopi pekat dan pencuci mulut untuk sesi lepak petang.",
      "menu.note": "Menu penuh dan promosi terkini ada di Instagram kami.",
      "menu.igLink": "Ikuti @cabinrose_",
      "amb.title": "Datang sebab lapar,  <em>stay</em>  sebab best.",
      "amb.body": "Lepak dengan keluarga, pasangan atau satu geng. Ambil kunci anda dan klik peta di bawah.",
      "ev.title": "Nak sambut birthday atau buat majlis?",
      "ev.body": "Jamuan, birthday party, majlis rasmi dan buffet. Bagitahu tarikh, kami siapkan tempat dan makanan.",
      "rev.title": "Kata pengunjung",
      "rev.q1.text": "“Deko simple, minimalis dan aesthetic. Harga berpatutan, rasa memang sedap.”",
      "rev.q1.who": "Ulasan pengunjung",
      "rev.q1.src": "di Google",
      "rev.q2.text": "“Corndog dia memang sedap. Wajib cuba kalau singgah Kemaman.”",
      "rev.q2.who": "Ulasan pengunjung",
      "rev.q2.src": "di TikTok",
      "rev.q3.text": "“Tempat yang sesuai untuk keluarga, pasangan dan kawan-kawan.”",
      "rev.q3.who": "Ulasan pengunjung",
      "rev.q3.src": "di Facebook",
      "rev.more": "Baca lagi ulasan di Google Maps",
      "loc.title": "Cari kami",
      "loc.day1": "Sabtu - Khamis",
      "loc.time1": "11:00 pagi - 11:00 malam",
      "loc.day2": "Jumaat",
      "loc.time2": "3:00 petang - 11:00 malam",
      "loc.cta": "Dapatkan Arah",
      "loc.mapClick": "Sentuh untuk interaksi peta",
      "foot.tag": "Kafe western di River Front, Kemaman. Sejak 2019.",
      "foot.rights": "Hak cipta terpelihara.",
      "menu.viewBtn": "Lihat Menu Penuh",
      "menu.info.title": "Sebelum lihat menu",
      "menu.info.body": "Sila pastikan semula ketersediaan menu dengan krew kami.",
      "menu.info.proceed": "Teruskan ke Menu",
      "menu.full.title": "Menu Penuh",
      "menu.full.note": "Harga mungkin berubah. Hubungi kami untuk pengesahan item & harga terkini.",
      "menu.full.hot": "Panas",
      "menu.full.cold": "Sejuk",
      "book.title": "Tempah Meja",
      "book.body": "Isi maklumat di bawah. Kami akan buka WhatsApp dengan mesej yang telah siap untuk anda hantar.",
      "book.name": "Nama",
      "book.date": "Tarikh",
      "book.time": "Masa",
      "book.pax": "Bilangan orang",
      "book.notes": "Catatan (pilihan)",
      "book.submit": "Hantar ke WhatsApp"
    },
    en: {
      "nav.menu": "Menu",
      "nav.ambience": "The Space",
      "nav.reviews": "Reviews",
      "nav.location": "Location",
      "hero.eyebrow": "River Front, Kemaman",
      "hero.title": "Cabin Rose Station",
      "hero.sub": "Hot corndogs, buttermilk rice and western classics by the Kemaman river. Open daily until 11 PM.",
      "hero.cta1": "Book Now",
      "hero.cta2": "View Menu",
      "bar.daily": "Open daily",
      "bar.dailyHours": "11:00 AM - 11:00 PM",
      "bar.fri": "Friday",
      "bar.friHours": "3:00 PM - 11:00 PM",
      "bar.call": "013-964 2739",
      "menu.title": "Must-try picks",
      "menu.i1.tag": "Best seller",
      "menu.i1.name": "Signature Corndog",
      "menu.i1.desc": "Crispy outside, molten cheese inside. The reason people keep coming back.",
      "menu.i2.name": "Buttermilk Rice",
      "menu.i2.desc": "Crispy chicken coated in a rich, creamy buttermilk sauce.",
      "menu.i3.name": "Chicken Chop & Grill",
      "menu.i3.desc": "Western classics, cooked fresh with homemade sauce.",
      "menu.i4.name": "Coffee & Dessert",
      "menu.i4.desc": "Good coffee and desserts for slow evenings.",
      "menu.note": "Full menu and latest promos on our Instagram.",
      "menu.igLink": "Follow @cabinrose_",
      "amb.title": "Come hungry,  <em>stay</em>  for the vibes.",
      "amb.body": "Hang out with family, your partner or the whole gang. Grab your keys and click the map below.",
      "ev.title": "Birthday or an event coming up?",
      "ev.body": "Banquets, birthday parties, official functions and buffets. Tell us the date, we'll sort the food and the space.",
      "rev.title": "What guests say",
      "rev.q1.text": "“Simple, minimal, aesthetic space. Reasonable prices and the food is genuinely good.”",
      "rev.q1.who": "Guest review",
      "rev.q1.src": "on Google",
      "rev.q2.text": "“The corndog is really good. A must-try when you stop by Kemaman.”",
      "rev.q2.who": "Guest review",
      "rev.q2.src": "on TikTok",
      "rev.q3.text": "“A great place for families, couples and friends.”",
      "rev.q3.who": "Guest review",
      "rev.q3.src": "on Facebook",
      "rev.more": "Read more reviews on Google Maps",
      "loc.title": "Find us",
      "loc.day1": "Saturday - Thursday",
      "loc.time1": "11:00 AM - 11:00 PM",
      "loc.day2": "Friday",
      "loc.time2": "3:00 PM - 11:00 PM",
      "loc.cta": "Get Directions",
      "loc.mapClick": "Tap to interact with map",
      "foot.tag": "A western cafe at River Front, Kemaman. Since 2019.",
      "foot.rights": "All rights reserved.",
      "menu.viewBtn": "View Full Menu",
      "menu.info.title": "Before you view the menu",
      "menu.info.body": "Please double confirm the availability of menu with our crew.",
      "menu.info.proceed": "Proceed to Menu",
      "menu.full.title": "Full Menu",
      "menu.full.note": "Prices may change. Contact us to confirm current items & prices.",
      "menu.full.hot": "Hot",
      "menu.full.cold": "Cold",
      "book.title": "Book a Table",
      "book.body": "Fill in your details below. We'll open WhatsApp with a ready-made message for you to send.",
      "book.name": "Name",
      "book.date": "Date",
      "book.time": "Time",
      "book.pax": "Number of guests",
      "book.notes": "Notes (optional)",
      "book.submit": "Send via WhatsApp"
    }
  };

  var LANG_KEY = "crs-lang";
  var toggle = document.getElementById("langToggle");

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.ms;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.innerHTML = dict[key];
    });
    document.documentElement.lang = lang;
    if (toggle) toggle.textContent = lang === "ms" ? "EN" : "BM";
    
    // Kemas kini tajuk dokumen secara dinamik untuk SEO dwi-bahasa
    document.title = lang === "ms" 
      ? "Cabin Rose Station | Cafe & Western Food Terbaik di Kemaman" 
      : "Cabin Rose Station | Best Cafe & Western Food in Kemaman";

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storan disekat: abaikan */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* abaikan */ }
  var currentLang = saved === "ms" ? "ms" : "en";
  applyLang(currentLang); // Terjemah dengan nilai lalai dahulu (elak flash skrin kosong)

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyLang(document.documentElement.lang === "ms" ? "en" : "ms");
    });
  }

  /* ---------- Nav mudah alih ---------- */
  var burger = document.getElementById("navBurger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reveal semasa skrol ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // Tanda "in" bila elemen masuk viewport ATAU sudah dilangkau ke atas (lompatan anchor)
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Pengendali Overlay Peta (Map Overlay Handler) ---------- */
  var mapOverlay = document.getElementById("mapOverlay");
  var mapIframe = document.querySelector(".map");
  if (mapOverlay && mapIframe) {
    // Tutup interaksi peta secara lalai
    mapIframe.style.pointerEvents = "none";

    mapOverlay.addEventListener("click", function () {
      mapOverlay.classList.add("hidden");
      mapIframe.style.pointerEvents = "auto";
    });

    var locationSection = document.getElementById("lokasi");
    if (locationSection) {
      locationSection.addEventListener("mouseleave", function () {
        mapOverlay.classList.remove("hidden");
        mapIframe.style.pointerEvents = "none";
      });
    }

    // Set semula sekiranya pengguna klik di luar peta
    document.addEventListener("click", function (e) {
      if (mapOverlay && !mapOverlay.parentElement.contains(e.target)) {
        mapOverlay.classList.remove("hidden");
        mapIframe.style.pointerEvents = "none";
      }
    }, true);
  }

  /* ---------- Menu penuh: makluman -> modal menu ---------- */
  // Data menu ikut brosur "Le Menu" Cabin Rose Station (CRS/CR/PZ).
  // hc: true = seksyen minuman dengan lajur harga Panas/Sejuk (null = tiada).
  var MENU = [
    { t: "Daily Signature", img: "img/corndog.webp", items: [
      ["CRS 001", "Corndog Cheese Tarik (Stretchy Mozarella Inside)", "8.00 /pcs"]
    ]},
    { t: "Waffles", img: "img/dessert-menu.webp", items: [
      ["CRS 002", "Classic Waffle", "6.50"],
      ["CRS 003", "Ice-Cream Waffle", "16.50"],
      ["CRS 004", "Mix Flavor Waffle", "8.00"],
      ["CRS 005", "Waffle Nutella", "9.50"]
    ]},
    { t: "Appetizer & Snacks", img: "img/food-menu.webp", items: [
      ["CRS 006", "Classic French Fries", "8.90"],
      ["CRS 006-1", "Cheesy Fries", "10.00"],
      ["CRS 007", "Classic Wedges", "8.50"],
      ["CRS 007-1", "Cheesy Wedges", "11.50"],
      ["CRS 008", "Nugget", "8.90"],
      ["CRS 009", "Keropok Lekor", "7.90"],
      ["CRS 010", "Chicken Cheese", "15.90"],
      ["CRS 011", "Chicken Korean Spicy", "15.90"],
      ["CRS 012", "Chicken Garlic", "15.90"],
      ["CRS 013", "Chicken Popcorn", "12.50"],
      ["CRS 057", "Curly Fries", "10.90"]
    ]},
    { t: "Set Nasi Putih (Plain Rice)", img: "img/buttermilk.webp", items: [
      ["CRS 014", "Nasi + Daging Menangis", "20.00"],
      ["CRS 015", "Rice + Buttermilk Chicken Popcorn", "18.00"],
      ["CRS 016", "Rice + Buttermilk Chicken Wing", "18.00"],
      ["CRS 017", "Rice + Chicken Korean Spicy", "18.00"],
      ["CRS 018", "Rice + Chicken Garlic", "18.00"],
      ["CRS 019", "Rice + Fried/Grill Chicken", "22.50"],
      ["CRS 020", "Rice + Lamb Grill", "26.50"]
    ]},
    { t: "Set Nasi Goreng", img: "img/hero_food.webp", items: [
      ["CRS 021", "Nasi Goreng Biasa", "8.00"],
      ["CRS 022", "Nasi Goreng Seafood", "12.50"],
      ["CRS 023", "Nasi Goreng + Fried Chicken Chop", "25.00"],
      ["CRS 024", "Nasi Goreng + Chicken Grill", "25.00"],
      ["CRS 025", "Nasi Goreng + Daging Menangis", "23.00"],
      ["CRS 026", "Nasi Goreng + Lamb Grill", "30.00"]
    ]},
    { t: "Fried & Grill", img: "img/chicken_chop.webp", items: [
      ["CRS 027", "Fried Chicken Chop", "19.50"],
      ["CRS 028", "Fish & Chip", "19.00"],
      ["CRS 029", "Chicken Chop Grill", "19.50"],
      ["CRS 030", "Lamb Chop Grill", "35.00"]
    ]},
    { t: "Pasta Variety", img: "img/hero_food.webp", items: [
      ["CRS 031", "Spaghetti Carbonara (Classic pasta with mushroom)", "18.00"],
      ["CRS 032", "Spaghetti Carbonara Beef/Chicken", "19.00"],
      ["CRS 033", "Spaghetti Aglio Olio Seafood", "19.00"],
      ["CRS 034", "Spaghetti Aglio Olio Beef", "18.00"],
      ["CRS 035", "Spaghetti Aglio Olio Chicken", "18.00"],
      ["CRS 036", "Spaghetti Carbonara Fried Chicken", "25.50"],
      ["CRS 037", "Spaghetti Aglio Olio Fried Chicken", "22.50"],
      ["CRS 038", "Spaghetti Carbonara Chicken Grill", "25.50"],
      ["CRS 039", "Spaghetti Carbonara Lamb Grill", "29.50"],
      ["CRS 040", "Spaghetti Aglio Olio Chicken Grill", "22.50"],
      ["CRS 041", "Spaghetti Aglio Olio Lamb Grill", "28.50"],
      ["CRS 056", "Spaghetti Beef Bolognese", "18.90"]
    ]},
    { t: "Burgers", img: "img/food-menu.webp", items: [
      ["CRS 042", "Fried Chicken Burger", "15.00"],
      ["CRS 043", "Korean Chicken Burger", "17.50"],
      ["CRS 044", "Homemade Beef Burger", "17.50"]
    ]},
    { t: "Ramen & Soup", img: "img/food-menu.webp", items: [
      ["CRS 045", "Set Ramen Korean Chicken & Wedges", "19.50"],
      ["CRS 046", "Set Ramen & Chicken Grill", "23.00"],
      ["CRS 047", "Mushroom Soup & Garlic Bread", "10.00"],
      ["CRS 048", "Set Meatball", "13.00"]
    ]},
    { t: "New In Menu!", img: "img/hero_food.webp", items: [
      ["CRS 049", "Nasi Goreng Daging", "15.00"],
      ["CRS 050", "Salmon Grill Salad", "39.90"],
      ["CRS 051", "Argentina Ribeye Steak", "80.00"],
      ["CRS 052", "Chicken Grill Salad", "28.90"],
      ["CRS 053", "Homemade Streaky Beef Burger", "24.00"],
      ["CRS 054", "Chicken Tender Soy Garlic", "13.90"],
      ["CRS 055", "Chicken Tender Sweet Korean", "13.90"]
    ]},
    { t: "Pizza Variety", img: "img/food-menu.webp", items: [
      ["PZ 01", "Beef Pepperoni Pizza", "21.90"],
      ["PZ 02", "Chicken Pepperoni Pizza", "21.90"],
      ["PZ 03", "Mix Beef & Chicken Pepperoni Pizza", "22.90"],
      ["PZ 04", "Chicken & Vegetables Pizza", "22.90"]
    ]},
    { t: "Beverages", img: "img/drinks.webp", hc: true, items: [
      ["CR 01", "Kopi Klasik", "4.00", "7.50"],
      ["CR 02", "Kopi Float", null, "9.00"],
      ["CR 03", "Kopi Nisang", null, "7.50"],
      ["CR 04", "Kopi Creamer", null, "9.00"],
      ["CR 05", "Kopi O'", "3.00", "3.50"],
      ["CR 06", "Nescafe", "4.50", "5.00"],
      ["CR 07", "Nescafe O'", "3.50", "4.00"]
    ]},
    { t: "Local Drinks", img: "img/drinks-menu.webp", hc: true, items: [
      ["CR 08", "Matcha Latte", null, "8.00"],
      ["CR 09", "Milo", "5.00", "6.00"],
      ["CR 10", "Milo O'", "2.50", "3.50"],
      ["CR 11", "Milo Tabur", null, "8.00"],
      ["CR 12", "Teh", "3.50", "4.50"],
      ["CR 13", "Teh O'", "2.00", "2.50"],
      ["CR 14", "Teh O' Lemon", "4.50", "8.50"],
      ["CR 15", "Sunquick", "2.50", "3.50"],
      ["CR 16", "Sirap", null, "3.00"],
      ["CR 17", "Sirap Bandung", null, "4.50"],
      ["CR 18", "Lemon", "6.00", "8.00"],
      ["CR 19", "Honey Lemon", "6.50", "9.00"],
      ["CR 20", "Limau Nipis", "4.00", "4.50"]
    ]},
    { t: "Bubble Drinks", img: "img/drinks-menu.webp", items: [
      ["CR 21", "Boba Milk", "7.00"],
      ["CR 22", "Boba Milo", "7.00"],
      ["CR 23", "Boba Chocolate", "7.00"],
      ["CR 24", "Boba Strawberry", "7.00"]
    ]},
    { t: "Ice-Cream", img: "img/dessert-menu.webp", items: [
      ["CR 25", "Boba Cococrunch", "12.00"],
      ["CR 26", "Biskoff Lotus", "12.00"],
      ["CR 27", "Nutella Oreo", "12.00"]
    ]},
    { t: "Soda & Mojito", img: "img/drinks-menu.webp", items: [
      ["CR 28", "Soda Lemon", "10.90"],
      ["CR 29", "Soda Strawberry", "10.90"],
      ["CR 30", "Classic Mojito", "10.90"],
      ["CR 31", "Blue Lemon", "10.90"],
      ["CR 32", "Mojito Blueberry", "11.90"]
    ]},
    { t: "Frappe Drinks", img: "img/drinks.webp", items: [
      ["CR 33", "Korean Strawberry", "17.00"],
      ["CR 34", "Blueberry", "17.00"],
      ["CR 35", "Biscoff Lotus", "17.00"],
      ["CR 36", "Kopi Klasik", "15.90"],
      ["CR 37", "Chocolate Milkshake", "15.90"],
      ["CR 38", "Milo", "15.90"],
      ["CR 39", "Matcha", "17.00"]
    ]}
  ];

  function eskep(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderMenu(sasaran) {
    var html = MENU.map(function (sek) {
      var kepala =
        '<div class="menu-sek-kepala">' +
        '<img src="' + sek.img + '" alt="" loading="lazy" width="88" height="88">' +
        "<h4>" + eskep(sek.t) + "</h4>" +
        (sek.hc
          ? '<span class="menu-sek-hc"><span data-i18n="menu.full.hot">Panas</span> / <span data-i18n="menu.full.cold">Sejuk</span></span>'
          : "") +
        "</div>";
      var baris = sek.items.map(function (it) {
        var harga = sek.hc
          ? '<span class="menu-harga">' + (it[2] ? "RM " + eskep(it[2]) : "&mdash;") + " / " + (it[3] ? "RM " + eskep(it[3]) : "&mdash;") + "</span>"
          : '<span class="menu-harga">RM ' + eskep(it[2]) + "</span>";
        return (
          '<li><span class="menu-kod">' + eskep(it[0]) + "</span>" +
          '<span class="menu-nama">' + eskep(it[1]) + "</span>" + harga + "</li>"
        );
      }).join("");
      return '<section class="menu-sek">' + kepala + "<ul>" + baris + "</ul></section>";
    }).join("");
    sasaran.innerHTML = html;
  }

  var menuBtn = document.getElementById("menuBtn");
  var menuInfo = document.getElementById("menuInfo");
  var menuPenuh = document.getElementById("menuPenuh");
  if (menuBtn && menuInfo && menuPenuh) {
    renderMenu(document.getElementById("menuPenuhIsi"));
    applyLang(document.documentElement.lang || currentLang); // terjemah elemen menu yang baru dirender

    var tutupSemua = function () {
      menuInfo.hidden = true;
      menuPenuh.hidden = true;
    };

    menuBtn.addEventListener("click", function () { menuInfo.hidden = false; });
    document.getElementById("menuInfoClose").addEventListener("click", tutupSemua);
    document.getElementById("menuPenuhClose").addEventListener("click", tutupSemua);
    document.getElementById("menuInfoProceed").addEventListener("click", function () {
      menuInfo.hidden = true;
      menuPenuh.hidden = false;
    });

    [menuInfo, menuPenuh].forEach(function (latar) {
      latar.addEventListener("click", function (e) {
        if (e.target === latar) tutupSemua();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") tutupSemua();
    });
  }

  /* ---------- Borang tempahan -> hantar ke WhatsApp ---------- */
  var bookingModal = document.getElementById("bookingModal");
  var bookingForm = document.getElementById("bookingForm");
  var bookTriggers = document.querySelectorAll(".js-book-now");
  if (bookingModal && bookingForm && bookTriggers.length) {
    var closeBooking = function () { bookingModal.hidden = true; };

    bookTriggers.forEach(function (btn) {
      btn.addEventListener("click", function () { bookingModal.hidden = false; });
    });
    document.getElementById("bookingClose").addEventListener("click", closeBooking);
    bookingModal.addEventListener("click", function (e) {
      if (e.target === bookingModal) closeBooking();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !bookingModal.hidden) closeBooking();
    });

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(bookingForm);
      var name = String(data.get("name") || "").trim();
      var date = String(data.get("date") || "");
      var time = String(data.get("time") || "");
      var pax = String(data.get("pax") || "");
      var notes = String(data.get("notes") || "").trim();
      var lang = document.documentElement.lang === "ms" ? "ms" : "en";

      var msg = lang === "ms"
        ? "Hai Cabin Rose Station, saya nak tempah meja.\n" +
          "Nama: " + name + "\n" +
          "Tarikh: " + date + "\n" +
          "Masa: " + time + "\n" +
          "Bilangan orang: " + pax +
          (notes ? "\nCatatan: " + notes : "")
        : "Hi Cabin Rose Station, I'd like to book a table.\n" +
          "Name: " + name + "\n" +
          "Date: " + date + "\n" +
          "Time: " + time + "\n" +
          "Pax: " + pax +
          (notes ? "\nNotes: " + notes : "");

      window.open("https://wa.me/60139642739?text=" + encodeURIComponent(msg), "_blank", "noopener");
      bookingForm.reset();
      closeBooking();
    });
  }
})();

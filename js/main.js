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
      "hero.cta1": "Tempah di WhatsApp",
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
      "menu.pdfBtn": "Muat Turun Menu PDF",
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
      "foot.rights": "Hak cipta terpelihara."
    },
    en: {
      "nav.menu": "Menu",
      "nav.ambience": "The Space",
      "nav.reviews": "Reviews",
      "nav.location": "Location",
      "hero.eyebrow": "River Front, Kemaman",
      "hero.title": "Cabin Rose Station",
      "hero.sub": "Hot corndogs, buttermilk rice and western classics by the Kemaman river. Open daily until 11 PM.",
      "hero.cta1": "Book on WhatsApp",
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
      "menu.pdfBtn": "Download PDF Menu",
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
      "foot.rights": "All rights reserved."
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
      if (mapContainer && !mapContainer.contains(e.target)) {
        mapOverlay.classList.remove("hidden");
        mapIframe.style.pointerEvents = "none";
      }
    }, true);
  }
})();

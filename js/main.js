/* Cabin Rose Station - interaksi ringkas: i18n BM/EN, nav mudah alih, reveal */

(function () {
  "use strict";

  /* ---------- Kamus dwibahasa ---------- */
  var I18N = {
    ms: {
      "nav.menu": "Menu",
      "nav.ambience": "Suasana",
      "nav.reviews": "Ulasan",
      "nav.faq": "FAQ",
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
      "bar.call": "Hubungi Kami",
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
      "gal.title": "Galeri",
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
      "rev.cta": "Beri Ulasan Google",
      "rev.more": "Baca lagi ulasan di Google Maps",
      "loc.title": "Cari kami",
      "loc.day1": "Sabtu - Khamis",
      "loc.time1": "11:00 pagi - 11:00 malam",
      "loc.day2": "Jumaat",
      "loc.time2": "3:00 petang - 11:00 malam",
      "loc.cta": "Dapatkan Arah",
      "loc.contact": "Hubungi Kami",
      "loc.mapClick": "Sentuh untuk interaksi peta",
      "foot.follow": "Ikuti kami",
      "foot.pay": "Kami terima",
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
      "faq.title": "Soalan lazim",
      "faq.q1": "Cabin Rose Station halal?",
      "faq.a1": "Ya, Cabin Rose Station dimiliki dan diuruskan oleh Muslim Bumiputera.",
      "faq.q2": "Apa waktu operasi Cabin Rose Station?",
      "faq.a2": "Kami buka setiap hari. Sabtu hingga Khamis dari 11:00 pagi sampai 11:00 malam, dan pada hari Jumaat kami buka lewat sedikit iaitu 3:00 petang sampai 11:00 malam.",
      "faq.q3": "Di mana lokasi Cabin Rose Station di Kemaman?",
      "faq.a3": "Kami di L 94-1, Jalan Raja Udang 3, River Front, 24000 Kemaman, Terengganu. Kafe kami terletak di tepi Sungai Kemaman dalam kawasan River Front.",
      "faq.q4": "Boleh tempah meja dahulu?",
      "faq.a4": "Boleh. Tekan butang Tempah Sekarang di laman ini dan isi borang ringkas, atau hubungi crew kami.",
      "faq.q5": "Boleh buat majlis atau birthday party di sini?",
      "faq.a5": "Boleh. Kami uruskan jamuan, birthday party, majlis rasmi dan buffet. Bagitahu tarikh dan bilangan tetamu kepada crew kami, kami siapkan tempat dan makanan.",
      "faq.q6": "Apa menu paling popular di sini?",
      "faq.a6": "Corndog Cheese Tarik dengan mozarella di dalamnya ialah yang paling laris. Nasi Buttermilk, Chicken Chop Grill serta pizza homemade juga antara pilihan utama pelanggan.",
      "faq.q7": "Berapa julat harga makanan di Cabin Rose Station?",
      "faq.a7": "Minuman bermula dari RM2.00 dan snek dari RM7.90. Kebanyakan set nasi dan hidangan western antara RM18 hingga RM26, manakala menu premium seperti Argentina Ribeye Steak mencecah RM80.00.",
      "book.title": "Tempahan",
      "book.body": "Isi maklumat di bawah. Kami akan buka WhatsApp dengan mesej yang telah siap untuk anda hantar.",
      "book.chooseType": "Pilih jenis tempahan dahulu:",
      "book.typeTable": "Meja Kafe",
      "book.typeEvent": "Event Space (CR Studio)",
      "book.back": "&larr; Tukar jenis tempahan",
      "book.name": "Nama",
      "book.date": "Tarikh",
      "book.time": "Masa",
      "book.pax": "Bilangan orang",
      "book.tel": "No. telefon",
      "book.deco": "Hiasan meja (deco)?",
      "book.decoNo": "Tidak",
      "book.decoYes": "Ya",
      "book.deposit": "Deposit (RM)",
      "book.depositRule": "Deposit wajib: RM200 untuk 10 pax ke atas · RM500 untuk 50 pax ke atas.",
      "book.payTo": "Bayar deposit ke:",
      "book.payTo2": "Bayar deposit ke:",
      "book.receiptNote": "Sila sertakan resit sebagai bukti pembayaran semasa menghantar mesej WhatsApp.",
      "book.receiptNote2": "Sila sertakan resit sebagai bukti pembayaran semasa menghantar mesej WhatsApp.",
      "book.notes": "Order menu / catatan (cth: menu yang nak diorder, permintaan khas)",
      "book.viewMenu": "Lihat Menu Penuh",
      "book.submit": "Hantar ke WhatsApp"
    },
    en: {
      "nav.menu": "Menu",
      "nav.ambience": "The Space",
      "nav.reviews": "Reviews",
      "nav.faq": "FAQ",
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
      "bar.call": "Contact Us",
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
      "gal.title": "Gallery",
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
      "rev.cta": "Leave a Google Review",
      "rev.more": "Read more reviews on Google Maps",
      "loc.title": "Find us",
      "loc.day1": "Saturday - Thursday",
      "loc.time1": "11:00 AM - 11:00 PM",
      "loc.day2": "Friday",
      "loc.time2": "3:00 PM - 11:00 PM",
      "loc.cta": "Get Directions",
      "loc.contact": "Contact Us",
      "loc.mapClick": "Tap to interact with map",
      "foot.follow": "Follow us",
      "foot.pay": "We accept",
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
      "faq.title": "Frequently asked questions",
      "faq.q1": "Is Cabin Rose Station halal?",
      "faq.a1": "Yes, Cabin Rose Station is owned and run by Muslim Bumiputera.",
      "faq.q2": "What are Cabin Rose Station's opening hours?",
      "faq.a2": "We open daily. Saturday to Thursday from 11:00 AM until 11:00 PM, and on Friday we open a little later, from 3:00 PM until 11:00 PM.",
      "faq.q3": "Where is Cabin Rose Station located in Kemaman?",
      "faq.a3": "We are at L 94-1, Jalan Raja Udang 3, River Front, 24000 Kemaman, Terengganu. Our cafe sits by the Kemaman river in the River Front area.",
      "faq.q4": "Can I book a table in advance?",
      "faq.a4": "Yes. Tap the Book Now button on this page and fill in the short form, or contact our crew.",
      "faq.q5": "Can I hold an event or birthday party here?",
      "faq.a5": "Yes. We handle banquets, birthday parties, official functions and buffets. Send the date and guest count to our crew and we will sort the space and the food.",
      "faq.q6": "What is the most popular dish here?",
      "faq.a6": "The Corndog Cheese Tarik with stretchy mozzarella inside is our best seller. Buttermilk Rice, Chicken Chop Grill and our homemade pizzas are also regular favourites.",
      "faq.q7": "What is the price range at Cabin Rose Station?",
      "faq.a7": "Drinks start from RM2.00 and snacks from RM7.90. Most rice sets and western mains fall between RM18 and RM26, while premium items such as the Argentina Ribeye Steak reach RM80.00.",
      "book.title": "Make a Booking",
      "book.body": "Fill in your details below. We'll open WhatsApp with a ready-made message for you to send.",
      "book.chooseType": "Choose your booking type first:",
      "book.typeTable": "Cafe Table",
      "book.typeEvent": "Event Space (CR Studio)",
      "book.back": "&larr; Change booking type",
      "book.name": "Name",
      "book.date": "Date",
      "book.time": "Time",
      "book.pax": "Number of guests",
      "book.tel": "Phone number",
      "book.deco": "Table decoration?",
      "book.decoNo": "No",
      "book.decoYes": "Yes",
      "book.deposit": "Deposit (RM)",
      "book.depositRule": "Deposit required: RM200 for 10 pax and above · RM500 for 50 pax and above.",
      "book.payTo": "Pay the deposit to:",
      "book.payTo2": "Pay the deposit to:",
      "book.receiptNote": "Please attach your payment receipt as proof when sending the WhatsApp message.",
      "book.receiptNote2": "Please attach your payment receipt as proof when sending the WhatsApp message.",
      "book.notes": "Menu order / notes (e.g. items you'd like to order, special requests)",
      "book.viewMenu": "View Full Menu",
      "book.submit": "Send via WhatsApp"
    }
  };

  var toggle = document.getElementById("langToggle");

  /* Setiap bahasa ada URL sendiri supaya hreflang berfungsi: "/" ialah BM,
     "/en/" ialah EN. URL yang menentukan bahasa - bukan localStorage. Kalau
     pilihan tersimpan yang menang, /en/ boleh terpapar dalam BM sedangkan
     itulah URL yang Google indeks sebagai halaman Inggeris.

     Teks statik sudah betul dalam HTML setiap halaman (en/index.html dijana
     oleh tools/build-en.php), jadi applyLang hanya perlu untuk kandungan
     yang dibina oleh JS, iaitu modal menu. */
  function langFromPath() {
    return /(^|\/)en(\/|$)/.test(location.pathname) ? "en" : "ms";
  }

  var currentLang = langFromPath();

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.ms;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.innerHTML = dict[key];
    });
  }

  if (toggle) {
    toggle.textContent = currentLang === "ms" ? "EN" : "BM";
    toggle.addEventListener("click", function () {
      // Relatif supaya berfungsi juga bila laman dihidangkan dari subfolder.
      location.href = currentLang === "ms" ? "en/" : "../";
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

  var menuBtn = document.getElementById("menuBtn");
  var menuInfo = document.getElementById("menuInfo");
  var menuPenuh = document.getElementById("menuPenuh");
  if (menuBtn && menuInfo && menuPenuh) {
    // Menu penuh dipapar sebagai poster imej (img/menu/*.webp) terus dalam
    // HTML #menuPenuhIsi — tiada lagi menu terjana kod. Modal cuma dibuka/tutup.
    var menuIsi = document.getElementById("menuPenuhIsi");
    // Sentiasa mula dari muka depan poster bila dibuka (skrol tak melekat).
    var bukaMenu = function () {
      menuPenuh.hidden = false;
      if (menuIsi) menuIsi.scrollTop = 0;
    };
    var tutupSemua = function () {
      menuInfo.hidden = true;
      menuPenuh.hidden = true;
    };

    menuBtn.addEventListener("click", function () { menuInfo.hidden = false; });
    document.getElementById("menuInfoClose").addEventListener("click", tutupSemua);
    document.getElementById("menuPenuhClose").addEventListener("click", tutupSemua);
    document.getElementById("menuInfoProceed").addEventListener("click", function () {
      menuInfo.hidden = true;
      bukaMenu();
    });

    // Dari borang tempahan: buka menu penuh terus (langkau notis) supaya
    // pelanggan boleh lihat item lalu tulis pesanan dalam ruangan catatan.
    document.querySelectorAll(".js-view-menu").forEach(function (btn) {
      btn.addEventListener("click", bukaMenu);
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

  /* ---------- Galeri carousel: gelung tak berkesudahan + butang ---------- */
  var galleryTrack = document.getElementById("galleryTrack");
  if (galleryTrack) {
    var galSlides = Array.prototype.slice.call(galleryTrack.querySelectorAll(".gallery-slide"));
    var setWidth = 0;

    if (galSlides.length > 1) {
      // Klon satu set slaid di setiap hujung supaya swipe/klik boleh "pusing"
      // tanpa nampak tepi kosong (punca "bug hujung" yang lama). Susun jadi
      // tiga set: [klon][asal][klon]; pelawat sentiasa duduk pada set tengah.
      // Klon aria-hidden — kandungan pendua, bukan untuk pembaca skrin/indeks.
      var firstReal = galSlides[0];
      galSlides.forEach(function (s) {
        var after = s.cloneNode(true);
        after.setAttribute("aria-hidden", "true");
        galleryTrack.appendChild(after);
      });
      galSlides.forEach(function (s) {
        var before = s.cloneNode(true);
        before.setAttribute("aria-hidden", "true");
        galleryTrack.insertBefore(before, firstReal);
      });

      // Lebar figura ditetapkan oleh CSS (bukan saiz imej), jadi scrollWidth
      // stabil walaupun imej lazy belum dimuat. Tiga set identik -> /3.
      var recalc = function () { setWidth = galleryTrack.scrollWidth / 3; };

      // Lompat SERTA-MERTA (tanpa animasi). .gallery-track ada
      // scroll-behavior:smooth dalam CSS — kalau tak dimatikan buat sekejap,
      // lompatan gelung akan beranimasi merentas slaid dan pelawat nampak
      // galeri "scroll balik". Kita mahu lompatan tak kelihatan.
      var jumpTo = function (x) {
        var prev = galleryTrack.style.scrollBehavior;
        galleryTrack.style.scrollBehavior = "auto";
        galleryTrack.scrollLeft = x;
        galleryTrack.style.scrollBehavior = prev;
      };

      recalc();
      jumpTo(setWidth); // mula pada set asal (tengah)

      // Bila scroll masuk zon klon, lompat sejauh satu set ke slaid sepadan
      // dalam set asal. Kandungan identik jadi lompatan tak kelihatan. Tunggu
      // scroll reda (~120ms) supaya momentum sentuh iOS tak terputus.
      //
      // Toleransi WAJIB di sini: scroll-snap-align:center merehatkan slaid
      // pada (offsetLeft + lebar/2 - lebar-viewport/2), bukan pada offsetLeft
      // semata-mata. Untuk galeri lebar (viewport > lebar satu slaid), ini
      // boleh terlepas sempadan setWidth/2*setWidth sebanyak >100px walaupun
      // rehat TEPAT pada slaid sebenar pertama/terakhir — tanpa toleransi,
      // rehat yang sah tersalah anggap sebagai "masih dalam zon klon" dan
      // dilonjak sekali lagi secara silap (disahkan lonjakan hantu semasa uji).
      var settleTimer = null;
      var normalize = function () {
        recalc();
        var tol = galStep(); // satu langkah slaid - lebih besar dari bunyi snap, kekal lebih kecil dari satu set
        var x = galleryTrack.scrollLeft;
        if (x < setWidth - tol) {
          jumpTo(x + setWidth);
        } else if (x >= setWidth * 2 + tol) {
          jumpTo(x - setWidth);
        }
      };
      galleryTrack.addEventListener("scroll", function () {
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(normalize, 120);
      }, { passive: true });
      window.addEventListener("resize", recalc);
    }

    var galStep = function () {
      var s = galleryTrack.querySelector(".gallery-slide");
      // Satu slaid + jurang (gap 1rem = 16px); swipe/scroll natif untuk sentuh.
      return s ? s.getBoundingClientRect().width + 16 : galleryTrack.clientWidth * 0.8;
    };
    var galPrev = document.getElementById("galleryPrev");
    var galNext = document.getElementById("galleryNext");
    if (galPrev) galPrev.addEventListener("click", function () { galleryTrack.scrollBy({ left: -galStep(), behavior: "smooth" }); });
    if (galNext) galNext.addEventListener("click", function () { galleryTrack.scrollBy({ left: galStep(), behavior: "smooth" }); });
  }

  /* ---------- Borang tempahan -> hantar ke WhatsApp ---------- */
  var bookingModal = document.getElementById("bookingModal");
  var bookingForm = document.getElementById("bookingForm");
  var bookTriggers = document.querySelectorAll(".js-book-now");
  if (bookingModal && bookingForm && bookTriggers.length) {
    var closeBooking = function () { bookingModal.hidden = true; };

    bookTriggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        resetChoice(); // SOP: setiap bukaan bermula dengan pilihan jenis
        bookingModal.hidden = false;
      });
    });
    document.getElementById("bookingClose").addEventListener("click", closeBooking);
    bookingModal.addEventListener("click", function (e) {
      if (e.target === bookingModal) closeBooking();
    });
    document.addEventListener("keydown", function (e) {
      // Jangan tutup borang bila menu penuh sedang terbuka atasnya —
      // Escape sepatutnya tutup menu sahaja dan kembali ke borang.
      var menuOpen = menuPenuh && !menuPenuh.hidden;
      if (e.key === "Escape" && !bookingModal.hidden && !menuOpen) closeBooking();
    });

    /* Dua jenis tempahan: meja kafe / event space (CR Studio), sebagai DUA
       SKRIN berasingan (bukan toggle dalam satu borang). SOP: pelanggan
       WAJIB pilih jenis dahulu (#bookChoice) - borang penuh (dengan medan
       + kotak deposit khusus jenis itu sahaja) baru dipapar selepas pilih.
       QR DuitNow milik akaun Cabin Rose Cafe (3817408419) - meja sahaja;
       event papar nombor akaun tanpa QR. */
    var bookChoice = document.getElementById("bookChoice");
    var bookBack = document.getElementById("bookBack");
    var btnTable = document.getElementById("bookTypeTable");
    var btnEvent = document.getElementById("bookTypeEvent");
    var typeInput = bookingForm.querySelector("[name=btype]");
    var paxInput = bookingForm.querySelector("[name=pax]");
    var depositInput = bookingForm.querySelector("[name=deposit]");
    var rowDeco = document.getElementById("bookRowDeco");
    var boxTable = document.getElementById("depositBoxTable");
    var boxEvent = document.getElementById("depositBoxEvent");

    // SOP deposit (kedua-dua jenis): 10 pax ke atas RM200, 50 ke atas RM500.
    var depositRule = function () {
      var pax = parseInt(paxInput.value, 10) || 0;
      var min = pax >= 50 ? 500 : pax >= 10 ? 200 : 0;
      depositInput.required = min > 0;
      depositInput.min = min;
      depositInput.placeholder = min > 0 ? "min RM" + min : "";
    };
    paxInput.addEventListener("input", depositRule);

    var setType = function (type) {
      typeInput.value = type;
      var isEvent = type === "event";
      bookChoice.hidden = true;      // sorok skrin pilihan
      bookingForm.hidden = false;    // papar borang jenis yang dipilih sahaja
      rowDeco.hidden = isEvent;
      boxTable.hidden = isEvent;
      boxEvent.hidden = !isEvent;
      depositRule();
    };
    btnTable.addEventListener("click", function () { setType("table"); });
    btnEvent.addEventListener("click", function () { setType("event"); });

    // Kembali ke skrin pilihan (butang "Tukar jenis" ATAU bukaan modal baru).
    var resetChoice = function () {
      bookingForm.hidden = true;
      bookChoice.hidden = false;
    };
    bookBack.addEventListener("click", resetChoice);

    // "19:30" -> "7:30 PM" (borang minta format 12 jam dalam mesej).
    var fmt12 = function (t) {
      if (!t) return "";
      var hm = t.split(":");
      var h = parseInt(hm[0], 10);
      var ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return h + ":" + hm[1] + " " + ap;
    };

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(bookingForm);
      var name = String(data.get("name") || "").trim();
      var date = String(data.get("date") || "");
      var time = fmt12(String(data.get("time") || ""));
      var pax = String(data.get("pax") || "");
      var tel = String(data.get("tel") || "").trim();
      var deco = String(data.get("deco") || "no") === "yes";
      var deposit = String(data.get("deposit") || "").trim();
      var notes = String(data.get("notes") || "").trim();
      var lang = currentLang;
      var msg;

      if (typeInput.value === "event") {
        // Format tetap ikut template owner (sama untuk BM/EN - staff kenal).
        msg =
          "🔰 BOOKING EVENT CR STUDIO 🔰\n" +
          "NAME: " + name + "\n" +
          "DATE & TIME: " + date + ", " + time + "\n" +
          "PEOPLE: " + pax + "\n" +
          "NO TELEFON: " + tel + "\n" +
          "DEPOSIT: RM " + deposit + "\n" +
          "Order menu: " + (notes || "-") + "\n\n" +
          "Saya akan sertakan resit deposit sebagai bukti pembayaran.";
      } else if (lang === "ms") {
        msg =
          "Hai Cabin Rose Station, saya nak tempah meja.\n" +
          "Nama: " + name + "\n" +
          "Tarikh: " + date + "\n" +
          "Masa: " + time + "\n" +
          "Bilangan orang: " + pax + "\n" +
          "No telefon: " + tel + "\n" +
          "Hiasan meja: " + (deco ? "Ya" : "Tidak") + "\n" +
          "Deposit meja: " + (deposit ? "RM " + deposit : "-") + "\n" +
          "Order menu: " + (notes || "-");
      } else {
        msg =
          "Hi Cabin Rose Station, I'd like to book a table.\n" +
          "Name: " + name + "\n" +
          "Date: " + date + "\n" +
          "Time: " + time + "\n" +
          "Pax: " + pax + "\n" +
          "Tel: " + tel + "\n" +
          "Decoration table: " + (deco ? "Yes" : "No") + "\n" +
          "Deposit Table: " + (deposit ? "RM " + deposit : "-") + "\n" +
          "Order menu: " + (notes || "-");
      }

      window.open("https://wa.me/60139642739?text=" + encodeURIComponent(msg), "_blank", "noopener");
      bookingForm.reset();
      resetChoice();
      closeBooking();
    });
  }
})();

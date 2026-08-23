/* ============================================================
   SMK Muhammadiyah 1 Klaten Utara — Interaksi
   - Navbar solid saat scroll + scrollspy menu aktif
   - Menu mobile (hamburger)
   - Scroll reveal (IntersectionObserver)
   - Animasi angka statistik
   - Tombol kembali ke atas
   - Modal detail jurusan
   ============================================================ */
(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
  const toTop = document.getElementById("toTop");

  /* ---------- Menu mobile: helper ---------- */
  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  /* ---------- 1. Navbar: solid setelah di-scroll + tombol ke atas ---------- */
  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
    // Tutup menu mobile saat pengguna menggulir halaman
    if (navMenu.classList.contains("open")) closeMenu();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menu mobile: toggle ---------- */
  navToggle.addEventListener("click", function () {
    const open = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  // Tutup menu setelah memilih tautan (mobile)
  navMenu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  // Tutup menu dengan Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- 2b. Modal detail jurusan ---------- */
  const modal = document.getElementById("jurusanModal");
  const jurusanCards = document.querySelectorAll(".jurusan-card");

  if (modal && jurusanCards.length) {
    const modalImg = document.getElementById("modalImg");
    const modalAbbr = document.getElementById("modalAbbr");
    const modalTitle = document.getElementById("modalTitle");
    const modalMateri = document.getElementById("modalMateri");
    const modalKerja = document.getElementById("modalKerja");
    const modalKuliah = document.getElementById("modalKuliah");
    const modalWirausaha = document.getElementById("modalWirausaha");
    const modalClose = modal.querySelector(".modal-close");
    let lastFocused = null;

    // Isi container dengan chip untuk tiap item (dipisah koma)
    function fillChips(container, value) {
      container.textContent = "";
      (value || "")
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .forEach(function (item) {
          const chip = document.createElement("span");
          chip.textContent = item; // textContent -> aman dari injeksi HTML
          container.appendChild(chip);
        });
    }

    function openModal(card) {
      const img = card.querySelector(".jurusan-card__media img");
      const title = card.dataset.title || (card.querySelector("h3") || {}).textContent || "";

      if (img && img.getAttribute("src")) {
        modalImg.src = img.getAttribute("src");
        modalImg.alt = img.getAttribute("alt") || title;
        modalImg.style.display = "";
      } else {
        modalImg.removeAttribute("src");
        modalImg.style.display = "none";
      }

      modalAbbr.textContent = card.dataset.abbr || "";
      modalAbbr.style.display = card.dataset.abbr ? "" : "none";
      modalTitle.textContent = title.trim();
      modalMateri.textContent = card.dataset.materi || "";
      modalWirausaha.textContent = card.dataset.wirausaha || "";
      fillChips(modalKerja, card.dataset.kerja);
      fillChips(modalKuliah, card.dataset.kuliah);

      lastFocused = document.activeElement;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      if (!modal.classList.contains("open")) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    jurusanCards.forEach(function (card) {
      card.addEventListener("click", function () { openModal(card); });
      // Dukungan keyboard: Enter / Spasi
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    // Tutup lewat tombol X atau klik area luar (overlay)
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
    });
    // Tutup dengan Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- 3. Tombol kembali ke atas ---------- */
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 4. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 5. Scrollspy: tandai menu aktif sesuai section ---------- */
  const sections = navLinks
    .map(function (link) {
      const id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- 6. Animasi angka statistik ---------- */
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const isThousand = el.getAttribute("data-format") === "thousand";
    const duration = 1600;
    const start = performance.now();

    function fmt(n) {
      return isThousand ? n.toLocaleString("id-ID") : String(n);
    }
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = fmt(target) + suffix;
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll(".stat__num[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObs.observe(c); });
  } else {
    counters.forEach(function (c) {
      const t = parseInt(c.getAttribute("data-count"), 10);
      const isThousand = c.getAttribute("data-format") === "thousand";
      c.textContent = (isThousand ? t.toLocaleString("id-ID") : String(t)) + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- 7. Tahun otomatis di footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

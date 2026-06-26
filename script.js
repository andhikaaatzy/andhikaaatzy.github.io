/* ============================================================
   SMK Muhammadiyah 1 Klaten Utara — Interaksi
   - Navbar solid saat scroll + scrollspy menu aktif
   - Menu mobile (hamburger)
   - Scroll reveal (IntersectionObserver)
   - Animasi angka statistik
   - Tombol kembali ke atas
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

/* ==========================================================================
   Got'Em Brushing LLC — Site JS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    var backTop = document.querySelector(".back-to-top");
    if (backTop) {
      if (window.scrollY > 500) backTop.classList.add("show");
      else backTop.classList.remove("show");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  var backTopBtn = document.querySelector(".back-to-top");
  if (backTopBtn) {
    backTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Set active nav link ---------- */
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var galleryItems = document.querySelectorAll(".gallery-item");
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        galleryItems.forEach(function (item) {
          var cat = item.getAttribute("data-category");
          if (filter === "all" || filter === cat) item.classList.remove("hide");
          else item.classList.add("hide");
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lightbox-cap");
    var visibleItems = function () {
      return Array.prototype.filter.call(galleryItems, function (i) {
        return !i.classList.contains("hide");
      });
    };
    var currentIndex = 0;

    function openLightbox(item) {
      var items = visibleItems();
      currentIndex = items.indexOf(item);
      renderLightbox();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function renderLightbox() {
      var items = visibleItems();
      var item = items[currentIndex];
      if (!item) return;
      var img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
    }
    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () { openLightbox(item); });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", function () {
      var items = visibleItems();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderLightbox();
    });
    lightbox.querySelector(".lightbox-nav.next").addEventListener("click", function () {
      var items = visibleItems();
      currentIndex = (currentIndex + 1) % items.length;
      renderLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightbox.querySelector(".lightbox-nav.prev").click();
      if (e.key === "ArrowRight") lightbox.querySelector(".lightbox-nav.next").click();
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var successBox = document.querySelector(".form-success");

    function setError(field, show) {
      field.classList.toggle("invalid", show);
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function validPhone(v) {
      return /^[\d\s\-\(\)\+\.]{7,20}$/.test(v);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var phone = form.querySelector("#phone");
      var message = form.querySelector("#message");

      var nameField = name.closest(".field");
      var emailField = email.closest(".field");
      var phoneField = phone.closest(".field");
      var messageField = message.closest(".field");

      if (!name.value.trim()) { setError(nameField, true); valid = false; } else setError(nameField, false);
      if (!validEmail(email.value.trim())) { setError(emailField, true); valid = false; } else setError(emailField, false);
      if (!validPhone(phone.value.trim())) { setError(phoneField, true); valid = false; } else setError(phoneField, false);
      if (!message.value.trim()) { setError(messageField, true); valid = false; } else setError(messageField, false);

      if (!valid) return;

      // No backend is connected yet — simulate a successful submission.
      // To go live, wire this form up to an email service (e.g. Formspree,
      // Netlify Forms) or your own backend endpoint.
      if (successBox) successBox.classList.add("show");
      form.reset();
      if (successBox) successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll(".current-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});

/* ==========================================================================
   Got'Em Brushing LLC — Parallax hero + scroll-driven house repaint
   (photo layers crossfade to simulate a real repaint as you scroll)
   ========================================================================== */
(function () {
  var section = document.getElementById("hero-scroll");
  if (!section) return;

  var stack = document.getElementById("hero-photo-stack");
  var photos = Array.prototype.slice.call(document.querySelectorAll(".house-photo"));
  var nameEl = document.querySelector(".swatch-color-name");
  var dots = document.querySelectorAll(".swatch-dot");
  var cue = document.querySelector(".scroll-cue");

  if (!photos.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Matches the data-color labels on each .house-photo, in document order.
  var COLOR_HEX = {
    "Cloud White": "#F2EEE3",
    "Sage Green": "#8B9A7B",
    "Coastal Navy": "#33475B",
    "Desert Clay": "#B97455",
    "Iron Charcoal": "#3B3A36"
  };

  dots.forEach(function (dot, i) {
    var photo = photos[i];
    if (photo) dot.style.background = COLOR_HEX[photo.getAttribute("data-color")] || "#ccc";
  });

  var ticking = false;

  function update() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var scrollable = section.offsetHeight - window.innerHeight;
    var progress = scrollable > 0 ? -rect.top / scrollable : 0;
    progress = Math.max(0, Math.min(1, progress));

    if (!reduceMotion && stack) {
      stack.style.transform = "translateY(" + (progress * -26) + "px) scale(" + (1 + progress * 0.06) + ")";
    }

    var segs = photos.length - 1;
    var scaled = Math.min(progress, 0.999999) * segs;
    var idx = Math.floor(scaled);
    var t = scaled - idx;

    photos.forEach(function (photo, i) {
      if (i === idx) photo.style.opacity = 1 - t;
      else if (i === idx + 1) photo.style.opacity = t;
      else photo.style.opacity = 0;
    });

    var activeIdx = t < 0.5 ? idx : idx + 1;
    var activeColor = photos[activeIdx] ? photos[activeIdx].getAttribute("data-color") : "";
    if (nameEl) nameEl.textContent = activeColor;
    dots.forEach(function (dot, i) { dot.classList.toggle("active", i === activeIdx); });
    if (cue) cue.classList.toggle("hide", progress > 0.05);
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

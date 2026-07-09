/* LVC Pressure Wash — interactions */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header scroll state ---- */
  var header = document.querySelector(".header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("in"); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---- Before / After slider ---- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var after = ba.querySelector(".after-layer");
    var handle = ba.querySelector(".ba-handle");
    var knob = ba.querySelector(".ba-knob");
    var range = ba.querySelector("input[type=range]");
    function set(v) {
      v = Math.max(0, Math.min(100, v));
      after.style.clipPath = "inset(0 0 0 " + v + "%)";
      handle.style.left = v + "%";
      if (knob) knob.style.left = v + "%";
      if (range && +range.value !== Math.round(v)) range.value = v;
    }
    if (range) {
      range.addEventListener("input", function () { set(+range.value); });
    }
    // pointer drag anywhere on the image
    var dragging = false;
    function fromEvent(clientX) {
      var r = ba.getBoundingClientRect();
      set(((clientX - r.left) / r.width) * 100);
    }
    ba.addEventListener("pointerdown", function (e) {
      dragging = true; ba.setPointerCapture(e.pointerId); fromEvent(e.clientX);
    });
    ba.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e.clientX); });
    ba.addEventListener("pointerup", function () { dragging = false; });
    ba.addEventListener("pointercancel", function () { dragging = false; });
    set(50);
  });

  /* ---- Seamless logo marquee (clone the set once so 4 logos scroll without a gap) ---- */
  if (!reduce) {
    document.querySelectorAll("[data-marquee]").forEach(function (track) {
      var originals = Array.prototype.slice.call(track.children);
      originals.forEach(function (node) {
        var clone = node.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    });
  }

  /* ---- Scroll-triggered autoplay video(s) ---- */
  var autos = document.querySelectorAll("video[data-autoscroll]");
  if (autos.length && "IntersectionObserver" in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: [0, 0.5, 1] });
    autos.forEach(function (v) { vo.observe(v); });
  } else {
    autos.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Contact form (front-end demo handling) ---- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Thanks — your request is ready to send. Connect this form to email or a CRM to go live.";
        status.style.color = "var(--cyan)";
      }
    });
  }
})();

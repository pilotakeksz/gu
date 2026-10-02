(function () {
  "use strict";

  /* GitHub Pages / global asset base: works when site is at origin/repo-name/ */
  window.SITE_BASE = (function () {
    var p = window.location.pathname || "";
    if (p === "" || p === "/") return "";
    var segs = p.split("/").filter(Boolean);
    return segs.length ? "/" + segs[0] + "/" : "";
  })();
  window.getAssetUrl = function (path) {
    var p = path && path.charAt(0) === "/" ? path.slice(1) : path || "";
    return (window.SITE_BASE || "") + p;
  };

  /* Footer year */
  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  /* Sliding nav selector */
  function initNavSelector() {
    var nav = document.querySelector("nav");
    if (!nav) return;

    function updateSelector() {
      var activeLink = nav.querySelector("a.active");
      if (!activeLink) return;

      var navRect = nav.getBoundingClientRect();
      var linkRect = activeLink.getBoundingClientRect();
      var relativeLeft = linkRect.left - navRect.left;

      var selector = nav;
      selector.style.setProperty("--selector-left", relativeLeft + "px");
      selector.style.setProperty("--selector-width", linkRect.width + "px");
      nav.classList.add("has-active");
    }

    updateSelector();
    window.addEventListener("resize", updateSelector);

    /* Update on hover for preview */
    var links = nav.querySelectorAll("a");
    links.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        var navRect = nav.getBoundingClientRect();
        var linkRect = link.getBoundingClientRect();
        var relativeLeft = linkRect.left - navRect.left;

        nav.style.setProperty("--selector-left", relativeLeft + "px");
        nav.style.setProperty("--selector-width", linkRect.width + "px");
      });
    });

    nav.addEventListener("mouseleave", updateSelector);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavSelector);
  } else {
    initNavSelector();
  }

  /* Use particles.js when available and keep a local canvas fallback for offline pages. */
  function initParticles() {
    var el = document.getElementById("particles-js");
    if (!el) return;
    if (typeof window.particlesJS !== "function") {
      initCanvasParticles(el);
      return;
    }
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 70, density: { enable: true, value_area: 900 } },
        color: { value: ["#5b9cff", "#e4b44d", "#3a7fd4"] },
        shape: { type: "circle" },
        opacity: { value: 0.48, random: true },
        size: { value: 2.4, random: true },
        line_linked: {
          enable: true,
          distance: 130,
          color: "#5b9cff",
          opacity: 0.24,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none",
          random: true,
          out_mode: "out"
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" }
        },
        modes: {
          grab: { distance: 120, line_linked: { opacity: 0.4 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }

  function initCanvasParticles(el) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var particles = [];
    var width;
    var height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({ length: Math.min(90, Math.floor(width / 16)) }, function () {
        return { x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 };
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      particles.forEach(function (particle, index) {
        particle.x = (particle.x + particle.vx + width) % width;
        particle.y = (particle.y + particle.vy + height) % height;
        context.fillStyle = index % 3 === 0 ? "rgba(228, 180, 77, 0.7)" : "rgba(91, 156, 255, 0.7)";
        context.beginPath();
        context.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        context.fill();
      });
      window.requestAnimationFrame(draw);
    }

    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);
    resize();
    window.addEventListener("resize", resize);
    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParticles);
  } else {
    initParticles();
  }
})();

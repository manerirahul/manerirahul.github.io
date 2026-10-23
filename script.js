// Starfield: two star layers drifting at different speeds + twinkle.
(function () {
  var canvas = document.getElementById('starfield');
  var ctx = canvas.getContext('2d');
  var stars = [];
  var W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];
    var count = Math.min(320, Math.floor(W * H / 4500));
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        speed: Math.random() * 0.25 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.y += s.speed;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      var tw = 0.55 + 0.45 * Math.sin(t / 700 + s.phase);
      ctx.globalAlpha = tw;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
})();

// Skip the crawl: jump straight to the saga.
document.getElementById('skip-crawl').addEventListener('click', function () {
  document.getElementById('saga').scrollIntoView({ behavior: 'smooth' });
});

// Reveal sections as they scroll into view.
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();

// Animated stat counters (only the numeric ones).
(function () {
  var nums = document.querySelectorAll('.stat-num[data-count]');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var target = parseInt(e.target.getAttribute('data-count'), 10);
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1200, 1);
        e.target.textContent = Math.round(target * p);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io.observe(n); });
})();

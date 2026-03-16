// ── PARTICLE ENGINE ──
function initSpoiler(textEl, canvasEl, hintEl) {
  const wrap = textEl.parentElement;
  let revealed = false;
  let animId;
  let particles = [];

  function resize() {
    canvasEl.width = wrap.offsetWidth;
    canvasEl.height = wrap.offsetHeight;
  }

  function spawnParticles() {
    particles = [];
    const count = Math.floor((canvasEl.width * canvasEl.height) / 8);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvasEl.width,
        y: Math.random() * canvasEl.height,
        r: Math.random() * 2.5 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        hue: 260 + Math.random() * 60, // purple to cyan range
      });
    }
  }

  function draw() {
    const ctx = canvasEl.getContext("2d");
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = canvasEl.width;
      if (p.x > canvasEl.width) p.x = 0;
      if (p.y < 0) p.y = canvasEl.height;
      if (p.y > canvasEl.height) p.y = 0;
      p.alpha += (Math.random() - 0.5) * 0.05;
      p.alpha = Math.max(0.1, Math.min(1, p.alpha));
    }
    if (!revealed) animId = requestAnimationFrame(draw);
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    textEl.classList.add("revealed");
    canvasEl.classList.add("hidden");
    if (hintEl) hintEl.classList.add("done");
    setTimeout(() => {
      cancelAnimationFrame(animId);
    }, 500);
  }

  function init() {
    resize();
    spawnParticles();
    textEl.style.visibility = 'visible';
    draw();
    wrap.addEventListener("click", reveal);
  }

  // Wait for fonts/layout
  setTimeout(init, 100);
}

// ── URL ENCODING ──
function encodeText(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeText(encoded) {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return null;
  }
}

// ── CHAR COUNT ──
const input = document.getElementById("spoiler-input");
const clearBtn = document.getElementById("clear-btn");

input.addEventListener("input", () => {
  const len = input.value.length;
  document.getElementById("char-count").textContent = `${len} / 1000`;
  clearBtn.style.display = len > 0 ? "inline-block" : "none";
});

function clearInput() {
  input.value = "";
  document.getElementById("char-count").textContent = "0 / 1000";
  clearBtn.style.display = "none";
  document.getElementById("result").classList.remove("visible");
  currentLink = "";
  input.focus();
}

// ── GENERATE LINK ──
let currentLink = "";

function generateLink() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const encoded = encodeText(text);
  const base = window.location.href.split("?")[0].split("#")[0];
  currentLink = `${base}?s=${encoded}`;
  document.getElementById("link-display").textContent = currentLink;
  document.getElementById("result").classList.add("visible");
  document.getElementById("copy-btn").textContent = "Copy";
  document.getElementById("copy-btn").classList.remove("copied");
}

function copyLink() {
  navigator.clipboard.writeText(currentLink).then(() => {
    const btn = document.getElementById("copy-btn");
    btn.textContent = "✓ Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2500);
  });
}

// ── PREVIEW MODAL ──
function previewSpoiler() {
  const text = input.value.trim();
  if (!text) return;
  const textEl = document.getElementById("modal-text");
  const canvasEl = document.getElementById("modal-canvas");
  const hintEl = document.getElementById("modal-hint");

  textEl.textContent = text;
  textEl.classList.remove("revealed");
  canvasEl.classList.remove("hidden");
  hintEl.classList.remove("done");

  document.getElementById("viewer").classList.add("open");
  setTimeout(() => initSpoiler(textEl, canvasEl, hintEl), 50);
}

function closeViewer() {
  document.getElementById("viewer").classList.remove("open");
}

document.getElementById("viewer").addEventListener("click", function (e) {
  if (e.target === this) closeViewer();
});

// ── ROUTE: VIEW PAGE ──
function checkRoute() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("s");

  if (encoded) {
    const text = decodeText(encoded);
    if (text) {
      document.getElementById("creator-page").classList.add("hidden");
      document.getElementById("view-page").classList.add("active");
      document.title = "SpoilerDrop — Someone hid a message for you";

      const textEl = document.getElementById("view-text");
      const canvasEl = document.getElementById("view-canvas");
      const hintEl = document.getElementById("view-hint");
      textEl.textContent = text;

      initSpoiler(textEl, canvasEl, hintEl);
    }
  }
}

function goToCreator() {
  window.location.href = window.location.pathname;
}

checkRoute();

const EVENT_DATE = new Date("2026-06-20T20:00:00");

const cover = document.getElementById("cover");
const openBtn = document.getElementById("openInvitation");
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confetti = [];
let animationFrame = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function openInvitation() {
  cover.classList.add("hidden");
  launchConfetti();
}

openBtn.addEventListener("click", openInvitation);
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;

  const ids = ["days", "hours", "minutes", "seconds"];
  const elements = ids.map((id) => document.getElementById(id));
  if (elements.some((el) => !el)) return;

  if (diff <= 0) {
    elements.forEach((el) => (el.textContent = "00"));
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const values = [days, hours, minutes, seconds].map((value) =>
    String(value).padStart(2, "0")
  );

  elements.forEach((el, index) => {
    if (el.textContent !== values[index]) {
      el.textContent = values[index];
      el.animate(
        [
          { transform: "scale(1)", opacity: 0.7 },
          { transform: "scale(1.18)", opacity: 1 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 280, easing: "ease-out" }
      );
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

function launchConfetti() {
  resizeCanvas();
  confetti = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    drift: -1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    spin: -8 + Math.random() * 16,
    color: ["#b71919", "#d7ad48", "#c26bae", "#7d468e", "#ffffff"][Math.floor(Math.random() * 5)],
    alpha: 1,
  }));

  if (animationFrame) cancelAnimationFrame(animationFrame);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.spin;
    piece.alpha -= 0.004;

    ctx.save();
    ctx.globalAlpha = Math.max(piece.alpha, 0);
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.rotation * Math.PI) / 180);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
    ctx.restore();
  });

  confetti = confetti.filter((piece) => piece.alpha > 0 && piece.y < canvas.height + 30);

  if (confetti.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationFrame = null;
  }
}

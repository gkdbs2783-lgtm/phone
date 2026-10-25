const screen = document.getElementById('lockScreen');
const timeLabel = document.getElementById('timeLabel');
const dateLabel = document.getElementById('dateLabel');

const updateClock = () => {
  const now = new Date();

  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);

  timeLabel.textContent = formattedTime.replace(' ', '');
  dateLabel.textContent = formattedDate;
};

updateClock();
setInterval(updateClock, 1000 * 30);

let tapCount = 0;
let lastTap = 0;

screen.addEventListener('pointerdown', (event) => {
  const now = Date.now();

  if (now - lastTap < 280) {
    tapCount += 1;
  } else {
    tapCount = 1;
  }

  lastTap = now;

  if (tapCount >= 2) {
    screen.classList.add('visible');
    tapCount = 0;
    lastTap = 0;
  }

  screen.setPointerCapture(event.pointerId);
});

let startY = null;

screen.addEventListener('pointerdown', (event) => {
  startY = event.clientY;
});

screen.addEventListener('pointermove', (event) => {
  if (startY === null || !screen.classList.contains('visible')) return;

  const deltaY = event.clientY - startY;

  if (deltaY < 0) {
    const dragged = Math.min(Math.abs(deltaY), 54);
    screen.style.transform = `translateY(${-dragged}px) scale(${1 - dragged / 900})`;
  }
});

screen.addEventListener('pointerup', () => {
  if (startY === null) return;
  startY = null;
  screen.style.transform = '';
});

window.addEventListener('load', () => {
  setTimeout(() => {
    screen.classList.remove('visible');
  }, 100);
});

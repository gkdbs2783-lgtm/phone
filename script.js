const phoneFrame = document.getElementById('phoneFrame');
const lockScreen = document.getElementById('lockScreen');
const timeLabel = document.getElementById('timeLabel');
const dateLabel = document.getElementById('dateLabel');
const homeDate = document.querySelector('.home-date');

const updateClock = () => {
  const now = new Date();

  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  };

  const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };

  const formattedTime = new Intl.DateTimeFormat('ko-KR', timeOptions).format(now);
  const formattedDate = new Intl.DateTimeFormat('ko-KR', dateOptions).format(now);

  timeLabel.textContent = formattedTime;
  dateLabel.textContent = formattedDate;
  homeDate.textContent = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(now);
};

const wakeScreen = () => {
  lockScreen.classList.add('visible');
};

let tapCount = 0;
let lastTapTime = 0;

phoneFrame.addEventListener('pointerdown', (event) => {
  const now = Date.now();

  if (!lockScreen.classList.contains('visible')) {
    wakeScreen();
    return;
  }

  if (now - lastTapTime < 280) {
    tapCount += 1;
  } else {
    tapCount = 1;
  }

  lastTapTime = now;

  if (tapCount >= 2) {
    wakeScreen();
    tapCount = 0;
  }

  event.preventDefault();
});

window.addEventListener('load', () => {
  updateClock();
  setInterval(updateClock, 30000);
  setTimeout(() => {
    wakeScreen();
  }, 170);
});

let dragStartY = null;
let dragDistance = 0;

const resetDragState = () => {
  dragStartY = null;
  dragDistance = 0;
  lockScreen.style.transform = '';
  lockScreen.style.opacity = '';
};

const unlockPhone = () => {
  phoneFrame.classList.add('unlocked');
  lockScreen.style.pointerEvents = 'none';
  lockScreen.style.opacity = '0';
  setTimeout(() => {
    lockScreen.classList.remove('visible');
  }, 250);
};

lockScreen.addEventListener('pointerdown', (event) => {
  if (!lockScreen.classList.contains('visible') || phoneFrame.classList.contains('unlocked')) return;
  dragStartY = event.clientY;
  lockScreen.setPointerCapture(event.pointerId);
});

lockScreen.addEventListener('pointermove', (event) => {
  if (dragStartY === null || phoneFrame.classList.contains('unlocked')) return;

  const delta = dragStartY - event.clientY;

  if (delta > 0) {
    dragDistance = Math.min(delta, 160);
    const lift = Math.min(dragDistance / 180, 1);
    lockScreen.style.transform = `translateY(-${dragDistance}px) scale(${1 - lift * 0.05})`;
    lockScreen.style.opacity = String(1 - lift * 0.25);
  }
});

lockScreen.addEventListener('pointerup', () => {
  if (dragStartY === null) return;

  if (dragDistance >= 110) {
    unlockPhone();
  }

  resetDragState();
});

lockScreen.addEventListener('pointercancel', () => {
  resetDragState();
});

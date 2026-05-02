// Configuration
const CONFIG = {
  REDIRECT_URL: 'http://35.175.213.18:3000/',
  LOADING_DURATION: 2500,  // milliseconds
  COUNTDOWN_DURATION: 5    // seconds
};

// Redirect logic
function startRedirect() {
  let countdownValue = CONFIG.COUNTDOWN_DURATION;
  
  // Auto-redirect after countdown
  const countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
      redirect();
    }
  }, 1000);
}

// Redirect to main app
function redirect() {
  window.location.href = CONFIG.REDIRECT_URL;
}

// Start redirect sequence
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(startRedirect, CONFIG.LOADING_DURATION);
});

// Optional: Allow immediate redirect on click/scroll
document.addEventListener('click', () => {
  redirect();
}, { once: true });

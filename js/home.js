document.addEventListener('DOMContentLoaded', function () {
  const username = getCookie('username');
  const welcomeMessage = username ? `Xin chào: ${username}` : 'Xin chào!';
  document.getElementById('welcome-message').innerText = welcomeMessage;
});

function getCookie(name) {
  return document.cookie.split('; ')
    .reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

const createSnowflake = () => {
  const snowflake = document.createElement('div');
  snowflake.className = 'snowflake';
  snowflake.textContent = '❄';
  snowflake.style.left = Math.random() * 100 + 'vw';
  snowflake.style.fontSize = Math.random() * 1.5 + 0.5 + 'em';
  snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
  snowflake.style.opacity = Math.random();
  document.body.appendChild(snowflake);

  snowflake.addEventListener('animationend', () => {
      snowflake.remove();
  });
};

setInterval(createSnowflake, 2000);
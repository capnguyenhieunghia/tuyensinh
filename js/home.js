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

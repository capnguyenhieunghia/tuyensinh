document.addEventListener('DOMContentLoaded', function () {
  const username = getCookie('username');
  const welcomeMessage = username ? `Xin chào, ${username}!` : 'Xin chào!';
  document.getElementById('welcome-message').innerText = welcomeMessage;
});

function getCookie(name) {
  return document.cookie.split('; ')
    .reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const mailtoLink = `mailto:tuyensinh@itc.edu.vn?subject=Thông điệp từ ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0D%0A%0D%0A---%0D%0ATừ: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}`;

  window.location.href = mailtoLink;
});
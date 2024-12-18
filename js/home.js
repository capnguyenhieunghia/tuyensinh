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


// slide
let slideIndex = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;

function showSlides() {
  slideIndex++;
  if (slideIndex > Math.floor(totalSlides / 3)) {
    slideIndex = 0; // Reset to first slide
  }
  const offset = -slideIndex * (100 / 2); // Tính toán độ dịch chuyển
  slides.style.transform = `translateX(${offset}%)`;

  // Thay đổi hình ảnh mỗi 6 giây
  setTimeout(showSlides, 3000);
}

// Gọi hàm để bắt đầu slideshow
showSlides();
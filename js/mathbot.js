function createFlower() {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = Math.random() * 100 + 'vw'; // Vị trí ngẫu nhiên
    document.body.appendChild(flower);
    setTimeout(() => flower.remove(), 5000); // Xóa sau 5 giây
}

function createSnow() {
    const snow = document.createElement('div');
    snow.className = 'snow';
    snow.style.left = Math.random() * 100 + 'vw'; // Vị trí ngẫu nhiên
    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 3000); // Xóa sau 3 giây
}
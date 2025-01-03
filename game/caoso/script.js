const scratchArea = document.getElementById('scratch-area');
const scratchOverlay = document.getElementById('scratch-overlay');
const car = document.getElementById('car');
const resultText = document.getElementById('result');
const resetButton = document.getElementById('reset-button');

let isScratching = false;
let scratched = 0;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function revealCar() {
    if (scratched >= 60) { // 60% area scratched
        const isWinner = randomInt(0, 1) === 1; // 50% chance to win
        if (isWinner) {
            resultText.textContent = "Chúc mừng! Bạn đã trúng thưởng!";
            car.style.display = 'block'; // Show the car if win
        } else {
            resultText.textContent = "Rất tiếc, bạn không trúng thưởng!";
        }
        scratchOverlay.style.pointerEvents = 'none'; // Disable further scratching
    }
}

function startScratching(event) {
    if (!isScratching) return;
    const rect = scratchArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const context = scratchOverlay.getContext('2d');
    context.globalCompositeOperation = 'destination-out';
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fill();

    scratched += 1;
    revealCar();
}

scratchArea.addEventListener('mousedown', () => {
    isScratching = true;
});

scratchArea.addEventListener('mousemove', (event) => {
    if (isScratching) {
        startScratching(event);
    }
});

scratchArea.addEventListener('mouseup', () => {
    isScratching = false;
});

resetButton.addEventListener('click', () => {
    scratchOverlay.style.pointerEvents = 'auto'; // Enable scratching again
    scratchOverlay.getContext('2d').clearRect(0, 0, scratchOverlay.width, scratchOverlay.height); // Clear scratch area
    scratched = 0;
    car.style.display = 'none'; // Hide the car
    resultText.textContent = "Cào để xem kết quả!";
});

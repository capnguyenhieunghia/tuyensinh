const gifts = [
    { name: "Gấu bông", probability: 5 }, // 0%
    { name: "Quạt ITC", probability: 0 }, // 0%
    { name: "Bút ITC", probability: 25 }, // 24%
    { name: "Bình Nước ITC", probability: 5 }, // 1%
    { name: "Gắp lại lần nữa", probability: 30 }, // 30%
    { name: "Chúc bạn máy mắn lần sau", probability: 35 }  // 45%
];

const fishingRod = document.getElementById('fishingRod');
const resultDiv = document.getElementById('result');
const giftContainer = document.getElementById('giftContainer');

document.getElementById('grabButton').addEventListener('click', function () {
    // Hiệu ứng gắp quà
    fishingRod.style.transform = 'translateY(-50px)';
    setTimeout(() => {
        const selectedGift = getRandomGift();
        resultDiv.textContent = `Bạn đã gắp: ${selectedGift.name}`;

        // Hiệu ứng thu quà
        const giftIndex = gifts.findIndex(gift => gift.name === selectedGift.name);
        const gift = giftContainer.children[giftIndex];
        gift.style.transform = 'scale(1.5)';
        setTimeout(() => {
            gift.style.transform = 'scale(1)';
            fishingRod.style.transform = 'translateY(0)';
        }, 2000);
    }, 500);
});

function getRandomGift() {
    const totalProbability = gifts.reduce((acc, gift) => acc + gift.probability, 0);
    const randomNum = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (const gift of gifts) {
        cumulativeProbability += gift.probability;
        if (randomNum <= cumulativeProbability) {
            return gift;
        }
    }
}
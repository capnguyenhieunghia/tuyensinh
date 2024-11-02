(() => {
    const $ = document.querySelector.bind(document);

    let timeRotate = 7000;
    let currentRotate = 0;
    let isRotating = false;
    const wheel = $('.wheel');
    const btnWheel = $('.btn--wheel');
    const showMsg = $('.msg');

    //=====< Danh sách phần thưởng >=====
    const listGift = [
        { text: 'Gấu bông ITC', chance: 5 }, //1%
        { text: 'Quạt ITC', chance: 0 }, // 0%
        { text: 'Quay lại lần nữa', chance: 10 }, //28%
        { text: 'Bình nước ITC', chance: 5 }, //1%
        { text: 'Balo ITC', chance: 0 }, //0%
        { text: 'Chúc bạn may mắn lần sau', chance: 30 }, //45%
        { text: 'Bút ITC', chance: 20 }, //10%
        { text: 'Quay lại lần nữa', chance: 30 } //35%
    ];

    const totalChance = 100;
    let cumulativeChance = 0;
    const cumulativeGifts = listGift.map(gift => {
        cumulativeChance += gift.chance;
        return {
            ...gift,
            cumulativeChance: cumulativeChance
        };
    });

    const size = listGift.length;
    const rotate = 360 / size;
    const skewY = 90 - rotate;

    cumulativeGifts.forEach((item, index) => {
        const elm = document.createElement('li');
        elm.style.transform = `rotate(${rotate * index}deg) skewY(-${skewY}deg)`;

        elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg);" class="text ${index % 2 === 0 ? 'text-1' : 'text-2'}">
            <b>${item.text}</b>
        </p>`;

        wheel.appendChild(elm);
    });

    const start = () => {
        showMsg.innerHTML = '';
        isRotating = true;
        const gift = getGift();
        currentRotate += 360 * 10;
        rotateWheel(currentRotate, gift.index);
        showGift(gift);
    };

    const rotateWheel = (currentRotate, index) => {
        $('.wheel').style.transform = `rotate(${currentRotate - index * rotate - rotate / 2}deg)`;
    };

    const getGift = () => {
        const random = Math.random() * totalChance; // Lấy giá trị ngẫu nhiên từ 0 đến 100
        let cumulative = 0; // Biến để theo dõi tỷ lệ tích lũy

        for (let i = 0; i < cumulativeGifts.length; i++) {
            if (cumulativeGifts[i].chance > 0) { // Kiểm tra xác suất
                cumulative += cumulativeGifts[i].chance;
                if (random < cumulative) {
                    return { ...cumulativeGifts[i], index: i };
                }
            }
        }

        return { text: 'Không có phần thưởng', index: -1 };
    };

    const showGift = gift => {
        let timer = setTimeout(() => {
            isRotating = false;
            showMsg.innerHTML = `👉 ${gift.text} 👈`;
            clearTimeout(timer);
        }, timeRotate);
    };

    btnWheel.addEventListener('click', () => {
        !isRotating && start();
    });
})();
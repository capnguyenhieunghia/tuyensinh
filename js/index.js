const sheetUrl = 'https://docs.google.com/spreadsheets/d/1FwJtZwByjsBmpp46I2i0jyY-SzfzDEaOKEukctoHw2k/gviz/tq?tqx=out:csv';

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('name').value.trim();
    const phoneInput = document.getElementById('phone').value.trim();
    const loadingDiv = document.getElementById('loading');
    const messageDiv = document.getElementById('message');

    loadingDiv.style.display = 'block';
    messageDiv.textContent = '';

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);
            let found = false;
            rows.forEach(row => {
                const cols = row.split(',').map(col => col.replace(/"/g, '').trim());
                const phone = cols[1];
                if (phone === phoneInput) {
                    found = true;
                }
            });

            loadingDiv.style.display = 'none';

            if (found) {
                setCookie('username', nameInput, 7);
                if (phoneInput === '0938861080') {
                    window.location.href = './page/quantri.html';
                } else {
                    messageDiv.textContent = 'Đăng nhập thành công!';
                    messageDiv.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1000);
                }
            } else {
                messageDiv.textContent = 'Thông tin không hợp lệ!';
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Có lỗi xảy ra:', error);
            messageDiv.textContent = 'Đã xảy ra lỗi. Vui lòng thử lại!';
        });
});


const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1gamv9wS8nO9FnKfcDZVqh419ypcdlBX87Px4ssDnOOU/gviz/tq?tqx=out:json';
let dataMap = {};
let suggestionsList = [];
let placeholderText = " / Hiển thị gợi ý";

function typePlaceholder() {
    const input = document.getElementById('userInput');
    let index = 0;
    input.placeholder = '';

    function type() {
        if (index < placeholderText.length) {
            input.placeholder += placeholderText[index++];
            setTimeout(type, 100);
        } else {
            setTimeout(deletePlaceholder, 1000);
        }
    }

    function deletePlaceholder() {
        if (input.placeholder.length > 0) {
            input.placeholder = input.placeholder.slice(0, -1);
            setTimeout(deletePlaceholder, 50);
        } else {
            index = 0;
            setTimeout(type, 500);
        }
    }

    type();
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

function saveChatHistory() {
    const messages = document.getElementById('messages').innerHTML;
    setCookie('chatHistory', messages, 7);
}

function loadChatHistory() {
    const chatHistory = getCookie('chatHistory');
    if (chatHistory) {
        document.getElementById('messages').innerHTML = chatHistory;
        const messagesDiv = document.getElementById('messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

fetch(SHEET_URL)
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data.substr(47).slice(0, -2));
        const rows = json.table.rows;
        if (rows.length) {
            rows.forEach(row => {
                const question = row.c[0]?.v.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); // Remove punctuation
                const answer = row.c[1]?.v;
                if (question && answer) {
                    dataMap[question] = answer;
                    suggestionsList.push(question);
                }
            });
            loadChatHistory();
        }
    })
    .catch(error => console.error('Lỗi:', error));

function displaySuggestions(inputValue) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';
    const filteredSuggestions = suggestionsList.filter(suggestion =>
        suggestion.startsWith(inputValue.slice(1).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")) // Remove punctuation
    );
    filteredSuggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion';
        div.textContent = suggestion;
        div.onclick = () => {
            document.getElementById('userInput').value = suggestion;
            sendMessage();
        };
        suggestionsDiv.appendChild(div);
    });
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value;
    if (message.trim() === '') return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    displayMessage(message, 'user', timestamp);
    input.value = '';
    showTypingIndicator();

    const response = autoReply(message);
    setTimeout(() => {
        hideTypingIndicator();
        displayMessage(response, 'bot', timestamp);
        saveChatHistory();
    }, 1000);
}

function displayMessage(message, sender, timestamp) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;

    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const formattedMessage = message.replace(urlPattern, '<a href="$1" target="_blank" style="color: navy; text-decoration: underline;">$1</a>');

    messageDiv.innerHTML = `
                <div>${formattedMessage}</div>
                <div class="message-footer">
                    <span class="sender">${sender === 'user' ? 'Bạn' : 'CĐ ITC'}</span>
                    <span class="timestamp">${timestamp}</span>
                    ${sender === 'bot' ? '<button class="speak-button" onclick="speakText(\'' + message.replace(/'/g, "\\'") + '\')">🎵</button>' : ''}
                </div>
            `;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(voice => voice.lang === 'VN');
    if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
    }

    window.speechSynthesis.speak(utterance);
}

function showTypingIndicator() {
    document.getElementById('typing').style.display = 'block';
}

function hideTypingIndicator() {
    document.getElementById('typing').style.display = 'none';
}

function autoReply(message) {
    const normalizedMessage = message.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); // Normalize message
    let bestMatch = null;
    let bestScore = 0;

    for (const question of Object.keys(dataMap)) {
        const keywords = question.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(' '); // Normalize question
        const messageWords = normalizedMessage.split(' ');

        // Tính toán độ tương đồng Jaccard
        const intersection = keywords.filter(word => messageWords.includes(word)).length;
        const union = new Set([...keywords, ...messageWords]).size;

        const similarityScore = intersection / union;

        // Kiểm tra nếu đây là câu hỏi tốt nhất cho đến nay
        if (similarityScore > bestScore) {
            bestScore = similarityScore;
            bestMatch = dataMap[question];
        }
    }

    return bestMatch || "Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng liên hệ với CĐ CNTT Tp. HCM qua số hotline: 093 886 1080.";
}

document.getElementById('userInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành động mặc định (gửi biểu mẫu)
        sendMessage(); // Gọi hàm sendMessage
    }
});

document.getElementById('userInput').addEventListener('input', function () {
    const inputValue = this.value;
    if (inputValue.startsWith('/')) {
        displaySuggestions(inputValue);
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

window.onload = function () {
    loadChatHistory();
    typePlaceholder();
};
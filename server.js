const express = require('express');
const path = require('path');
const app = express();

// Указываем папку public для статики
app.use(express.static('public'));

// Обязательно для парсинга JSON в req.body
app.use(express.json());

// Корень '/' отдает index.html
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/* ========================================================
   API ЭНДПОИНТЫ ДЛЯ ШИФРОВАНИЯ (ИНТЕГРАЦИЯ ПЕРВОГО КОДА)
======================================================== */

// 1. Шифр Цезаря (с поддержкой EN и RU)
app.post('/api/caesar', (req, res) => {
    const { text, shift } = req.body;
    const parsedShift = parseInt(shift) || 0;

    if (!text) {
        return res.json({ error: 'Заполните поля выше...' });
    }

    const result = text.split('').map(ch => {
        if (/[a-zA-Z]/.test(ch)) {
            const base = ch >= 'a' ? 97 : 65;
            return String.fromCharCode((ch.charCodeAt(0) - base + parsedShift + 26) % 26 + base);
        }
        if (/[а-яёА-ЯЁ]/.test(ch)) {
            const base = ch >= 'а' ? 1072 : 1040;
            const size = ch === 'ё' || ch === 'Ё' ? 33 : 32;
            return String.fromCharCode((ch.charCodeAt(0) - base + parsedShift + size) % size + base);
        }
        return ch;
    }).join('');

    res.json({ result });
});

// 2. Шифр транспонирования (перестановки)
app.post('/api/transposition', (req, res) => {
    const { text, cols } = req.body;
    const parsedCols = parseInt(cols) || 0;

    if (!text || parsedCols < 2) {
        return res.json({ error: 'Заполните поля выше...' });
    }

    const cleanText = text.replace(/\s/g, '');
    const rows = Math.ceil(cleanText.length / parsedCols);
    const padded = cleanText.padEnd(rows * parsedCols, '_');

    let result = '';
    for (let c = 0; c < parsedCols; c++) {
        for (let r = 0; r < rows; r++) {
            result += padded[r * parsedCols + c];
        }
    }

    res.json({ result });
});

// 3. Шифр Виженера
app.post('/api/vigenere', (req, res) => {
    const { text, key } = req.body;

    if (!text || !key) {
        return res.json({ error: 'Заполните поля выше...' });
    }

    const cleanKey = key.toLowerCase();
    let ki = 0;

    const result = text.split('').map(ch => {
        if (/[a-zA-Z]/.test(ch)) {
            const base = ch >= 'a' ? 97 : 65;
            const shift = cleanKey[ki % cleanKey.length].charCodeAt(0) - 97;
            ki++;
            return String.fromCharCode((ch.charCodeAt(0) - base + shift) % 26 + base);
        }
        return ch;
    }).join('');

    res.json({ result });
});

// 4. Шифр A1Z26
app.post('/api/a1z26', (req, res) => {
    const { text, sep } = req.body;
    const separator = sep || '-';

    if (!text) {
        return res.json({ error: 'Заполните поля выше...' });
    }

    const upperText = text.toUpperCase();
    const result = upperText.split('').map(ch => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) return code - 64;
        if (ch === ' ') return '/';
        return ch;
    }).join(separator);

    res.json({ result });
});


/* ========================================================
   СТАРЫЙ МАРШРУТ (СОХРАНЕН ДЛЯ СОВМЕСТИМОСТИ)
======================================================== */
app.post('/api/message', (req, res) => {
    const userText = req.body.caesarText?.toUpperCase() || "";
    const userVal = req.body.caesarValue || 0;
    const alfabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let message = "";
    for (let i = 0; i < userText.length; i++) {
        const index = alfabet.indexOf(userText[i]);
        if (index !== -1) {
            message += alfabet[(index + +userVal) % 26];
        } else {
            message += userText[i];
        }
    }
    res.json({ info: `Сервер отправил: "${message}"` });
});

app.listen(3000, () => console.log('Сервер запущен: http://localhost:3000'));
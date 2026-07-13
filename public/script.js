async function sendToServer(cardNumber) {
    let text, param, endpoint, successMessage;

    switch (cardNumber) {
        case 1: // Цезарь
            text = document.getElementById('c1_text').value.trim();
            param = document.getElementById('c1_shift').value;
            endpoint = '/api/caesar';
            successMessage = 'Шифр Цезаря успешно отправлен';
            break;

        case 2: // Транспонирование
            text = document.getElementById('c2_text').value.trim();
            param = document.getElementById('c2_cols').value;
            endpoint = '/api/transposition';
            successMessage = 'Шифр транспонирования успешно отправлен';
            break;

        case 3: // Виженера
            text = document.getElementById('c3_text').value.trim();
            param = document.getElementById('c3_key').value.trim();
            endpoint = '/api/vigenere';
            successMessage = 'Шифр Виженера успешно отправлен';
            break;

        case 4: // A1Z26
            text = document.getElementById('c4_text').value.trim();
            param = document.getElementById('c4_sep').value || '-';
            endpoint = '/api/a1z26';
            successMessage = 'A1Z26 успешно отправлен';
            break;

        default:
            alert('Неизвестная карточка');
            return;
    }

    if (!text) {
        alert('Пожалуйста, введите текст!');
        return;
    }

    // Показываем индикатор загрузки
    const outElement = document.getElementById(`c${cardNumber}_out`);
    const originalText = outElement.innerHTML;
    outElement.innerHTML = '<em>Отправка на сервер...</em>';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                shift: param,      // для Цезаря
                cols: param,       // для транспонирования
                key: param,        // для Виженера
                sep: param         // для A1Z26
            })
        });

        const data = await response.json();

        if (data.error) {
            outElement.innerHTML = `<span style="color:#ff6b6b;">Ошибка: ${data.error}</span>`;
            alert(data.error);
        } else if (data.result !== undefined) {
            outElement.innerHTML = `<strong>${data.result}</strong>`;
        } else {
            outElement.innerHTML = originalText;
            alert('Неожиданный ответ от сервера');
        }
    } catch (error) {
        console.error(error);
        outElement.innerHTML = `<span style="color:#ff6b6b;">Ошибка соединения</span>`;
        alert('Не удалось подключиться к серверу');
    }
}

function flip(cardId, flipped) {
    document.getElementById(cardId).classList.toggle('flipped', flipped);
}
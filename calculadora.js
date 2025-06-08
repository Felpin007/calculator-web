const display = document.getElementById('display');
const preview = document.getElementById('preview');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');

let currentExpression = '';
let shouldResetDisplay = false;

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        themeToggle.innerText = 'Tema: Escuro';
    } else {
        themeToggle.innerText = 'Tema: Claro';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('calc-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else {
        applyTheme('light');
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('calc-theme', nextTheme);
    applyTheme(nextTheme);
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

function appendNumber(number) {
    if (display.innerText === '0' || shouldResetDisplay) {
        display.innerText = number;
        shouldResetDisplay = false;
    } else {
        if (display.innerText.length < 15) {
            display.innerText += number;
        }
    }
    updatePreview();
}

function appendOperator(operator) {
    const lastChar = display.innerText.slice(-1);
    const operators = ['+', '-', '*', '/', '%'];

    shouldResetDisplay = false;

    if (operators.includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + operator;
    } else {
        display.innerText += operator;
    }
}

function clearDisplay() {
    display.innerText = '0';
    preview.innerText = '';
    currentExpression = '';
}

function deleteDigit() {
    if (display.innerText.length === 1) {
        display.innerText = '0';
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
    updatePreview();
}

function updatePreview() {
    const expression = display.innerText;
    if (!expression.match(/[+\-*/%]/)) {
        preview.innerText = '';
        return;
    }

    try {
        const result = eval(expression);
        if (isFinite(result)) {
            preview.innerText = result;
        }
    } catch (e) {
    }
}

function calculateResult() {
    try {
        const expression = display.innerText;
        const result = eval(expression);

        if (!isFinite(result)) {
            display.innerText = 'Erro';
            shouldResetDisplay = true;
            return;
        }

        addToHistory(expression, result);

        display.innerText = result;
        preview.innerText = '';
        shouldResetDisplay = true;

    } catch (error) {
        display.innerText = 'Erro';
        shouldResetDisplay = true;
    }
}

function addToHistory(exp, res) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <span>${exp}</span>
        <span class="history-result">= ${res}</span>
    `;

    item.onclick = () => {
        display.innerText = res;
        shouldResetDisplay = false;
        updatePreview();
    };

    historyList.insertBefore(item, historyList.firstChild);
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/[0-9]/.test(key)) appendNumber(key);
    if (['+', '-', '*', '/', '%'].includes(key)) appendOperator(key);
    if (key === 'Enter') { event.preventDefault(); calculateResult(); }
    if (key === 'Backspace') deleteDigit();
    if (key === 'Escape') clearDisplay();
    if (key === '.') appendNumber('.');
});

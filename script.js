let currentWordIndex = 0;
let words = []; // כאן תאוחסן רשימת המילים
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

const wordElement = document.getElementById('word');
const optionsElement = document.getElementById('options');
const messageElement = document.getElementById('message');
const saveWordBtn = document.getElementById('save-word-btn');
const pronounceBtn = document.getElementById('pronounce-btn');
const sentenceExampleElement = document.getElementById('sentence-example');

function checkAnswer(selectedOption) {
    const selectedAnswer = selectedOption.textContent;
    const correctAnswer = words[currentWordIndex].translation;

    if (selectedAnswer === correctAnswer) {
        messageElement.textContent = 'צדקת!';
        // בשלב הבא נוסיף כאן מעבר למילה הבאה
    } else {
        messageElement.textContent = 'טעית.';
    }
}

// בהמשך נוסיף כאן פונקציות נוספות לטעינת מילים, הצגתן, שמירה ועוד.

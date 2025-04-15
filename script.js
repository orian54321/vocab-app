// קבלת הפניות לאלמנטים מהדף index.html
const wordElement = document.getElementById('english-word');
const sentenceElement = document.getElementById('sentence');
const optionsElement = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const speakBtn = document.getElementById('speak-btn');
const saveBtn = document.getElementById('save-word-btn');

// אחסון רשימת המילים השמורות ב-localStorage
let savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');

// מערך מילים לדוגמא – ניתן לעדכן בהמשך עם רשימה גדולה יותר
const words = [
  {
    english: 'apple',
    hebrewOptions: ['בננה', 'תפוח', 'אגס', 'שזיף'],
    correct: 'תפוח',
    sentence: 'I eat an ____ every morning.'
  },
  {
    english: 'dog',
    hebrewOptions: ['חתול', 'ציפור', 'כלב', 'דג'],
    correct: 'כלב',
    sentence: 'My ____ loves to play with the ball.'
  }
];

let currentWord = {};

// פונקציה לטעינת מילה אקראית
function loadWord() {
  feedbackElement.textContent = '';
  nextBtn.disabled = true;
  optionsElement.innerHTML = '';

  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];

  wordElement.textContent = currentWord.english;
  sentenceElement.textContent = currentWord.sentence.replace('____', '_____');

  currentWord.hebrewOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsElement.appendChild(btn);
  });
}

// פונקציה לבדיקת הבחירה של המשתמש
function checkAnswer(selected) {
  if (selected === currentWord.correct) {
    feedbackElement.textContent = '✅ נכון!';
    nextBtn.disabled = false;
  } else {
    feedbackElement.textContent = '❌ לא נכון, נסה שוב.';
  }
}

nextBtn.onclick = loadWord;

speakBtn.onclick = () => {
  const utterance = new SpeechSynthesisUtterance(currentWord.english);
  speechSynthesis.speak(utterance);
};

saveBtn.onclick = () => {
  if (!savedWords.includes(currentWord.english)) {
    savedWords.push(currentWord.english);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
  }
};

loadWord();

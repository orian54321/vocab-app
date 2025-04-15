// רשימת מילים (תיקייה 1 לדוגמה)
const wordsList = [
  {
    word: "apple",
    correct: "תפוח",
    options: ["תפוח", "כיסא", "חתול", "ספר"],
    sentence: "I eat an ______ every morning."
  },
  {
    word: "dog",
    correct: "כלב",
    options: ["חתול", "ילד", "כלב", "מים"],
    sentence: "The ______ is barking loudly."
  },
  {
    word: "book",
    correct: "ספר",
    options: ["מיטה", "ספר", "שולחן", "בית"],
    sentence: "She is reading a ______."
  }
];

let currentWordIndex = 0;
let answeredCorrectly = false;

document.addEventListener("DOMContentLoaded", () => {
  loadWord();

  // כפתור שמע
  document.getElementById("speak-btn").onclick = () => {
    const utterance = new SpeechSynthesisUtterance(wordsList[currentWordIndex].word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // כפתור שמירה
  document.getElementById("save-btn").onclick = () => {
    alert("נשמור את המילה בהמשך.");
  };

  // כפתור מילים שמורות
  document.getElementById("show-saved-btn").onclick = () => {
    alert("כאן תוצג רשימת מילים שמורות.");
  };
});

function loadWord() {
  const wordObj = wordsList[currentWordIndex];
  const wordEl = document.getElementById("english-word");
  const choicesEl = document.getElementById("choices");
  const feedbackEl = document.getElementById("feedback");
  const sentenceEl = document.getElementById("sentence");

  answeredCorrectly = false;

  // ניקוי קודם
  wordEl.textContent = wordObj.word;
  sentenceEl.textContent = wordObj.sentence;
  feedbackEl.textContent = "";
  choicesEl.innerHTML = "";

  // הצגת תשובות
  wordObj.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    choicesEl.appendChild(btn);
  });
}

function checkAnswer(option) {
  const wordObj = wordsList[currentWordIndex];
  const feedbackEl = document.getElementById("feedback");

  if (answeredCorrectly) return;

  if (option === wordObj.correct) {
    feedbackEl.textContent = "✅ נכון!";
    answeredCorrectly = true;
    showNextButton();
  } else {
    feedbackEl.textContent = "❌ טעות, נסה שוב.";
  }
}

function showNextButton() {
  const feedbackEl = document.getElementById("feedback");

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "הבא ➡️";
  nextBtn.style.marginTop = "10px";
  nextBtn.onclick = () => {
    currentWordIndex++;
    if (currentWordIndex >= wordsList.length) {
      alert("הגעת לסוף הרשימה!");
      currentWordIndex = 0;
    }
    loadWord();
  };

  feedbackEl.appendChild(document.createElement("br"));
  feedbackEl.appendChild(nextBtn);
}

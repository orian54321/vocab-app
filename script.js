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

  document.getElementById("speak-btn").addEventListener("click", () => {
    const word = wordsList[currentWordIndex].word;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    alert("המילה תישמר לרשימת מילים שמורות (בהמשך).");
  });

  document.getElementById("show-saved-btn").addEventListener("click", () => {
    alert("כאן תוצג רשימת מילים שמורות (בהמשך).");
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (!answeredCorrectly) {
      alert("עליך לבחור את התשובה הנכונה לפני שתוכל להמשיך.");
      return;
    }
    currentWordIndex++;
    if (currentWordIndex >= wordsList.length) {
      alert("הגעת לסוף הרשימה!");
      currentWordIndex = 0;
    }
    loadWord();
  });
});

function loadWord() {
  const wordObj = wordsList[currentWordIndex];
  document.getElementById("english-word").textContent = wordObj.word;
  document.getElementById("sentence").textContent = wordObj.sentence;
  document.getElementById("feedback").textContent = "";
  answeredCorrectly = false;

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  wordObj.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.addEventListener("click", () => {
      if (answeredCorrectly) return;

      if (option === wordObj.correct) {
        document.getElementById("feedback").textContent = "✅ תשובה נכונה!";
        answeredCorrectly = true;
      } else {
        document.getElementById("feedback").textContent = "❌ טעות, נסה שוב.";
      }
    });
    choicesContainer.appendChild(btn);
  });
}

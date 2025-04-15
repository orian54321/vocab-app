const wordData = {
  word: "apple",
  correct: "תפוח",
  options: ["תפוח", "כיסא", "חלון", "חתול"],
  sentence: "I eat an ______ every morning."
};

document.addEventListener("DOMContentLoaded", () => {
  const wordEl = document.getElementById("english-word");
  const choicesEl = document.getElementById("choices");
  const feedbackEl = document.getElementById("feedback");
  const sentenceEl = document.getElementById("sentence");

  // הצגת מילה
  wordEl.textContent = wordData.word;

  // הצגת משפט
  sentenceEl.textContent = wordData.sentence;

  // הצגת אפשרויות
  wordData.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      if (option === wordData.correct) {
        feedbackEl.textContent = "✅ נכון!";
      } else {
        feedbackEl.textContent = "❌ טעות, נסה שוב.";
      }
    };
    choicesEl.appendChild(btn);
  });

  // שמיעת מילה
  document.getElementById("speak-btn").onclick = () => {
    const utterance = new SpeechSynthesisUtterance(wordData.word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // שמירת מילה
  document.getElementById("save-btn").onclick = () => {
    alert("הוספת את המילה לרשימת מילים שמורות (נוסיף בהמשך).");
  };

  // כפתור מילים שמורות
  document.getElementById("show-saved-btn").onclick = () => {
    alert("תיקיית מילים שמורות תיפתח כאן בהמשך.");
  };
});

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
let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadWord();

  document.getElementById("speak-btn").addEventListener("click", () => {
    const word = wordsList[currentWordIndex].word;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    const word = wordsList[currentWordIndex].word;
    if (!savedWords.includes(word)) {
      savedWords.push(word);
      localStorage.setItem("savedWords", JSON.stringify(savedWords));
      alert(`המילה "${word}" נשמרה לרשימת מילים שמורות.`);
    } else {
      alert(`המילה "${word}" כבר קיימת ברשימת מילים שמורות.`);
    }
  });

  document.getElementById("show-saved-btn").addEventListener("click", showSavedWords);

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
  document.getElementById("sentence").textContent = wordObj.sentence.replace(wordObj.word, "______");
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

function showSavedWords() {
  const list = document.getElementById("saved-words-list");
  list.innerHTML = "";

  if (savedWords.length === 0) {
    list.innerHTML = "<li>אין מילים שמורות עדיין.</li>";
  } else {
    savedWords.forEach((word, index) => {
      const li = document.createElement("li");
      li.textContent = word + " ";
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌ הסר";
      removeBtn.addEventListener("click", () => {
        savedWords.splice(index, 1);
        localStorage.setItem("savedWords", JSON.stringify(savedWords));
        showSavedWords(); // מרענן את הרשימה
      });
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }

  document.getElementById("saved-words-container").classList.remove("hidden");
}

function closeSavedWords() {
  document.getElementById("saved-words-container").classList.add("hidden");
}

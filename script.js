const folders = {
  1: [
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
  ],
  2: [], // נוסיף תוכן בהמשך
  3: []  // נוסיף תוכן בהמשך
};

let currentFolder = 1;
let wordsList = folders[currentFolder];
let currentWordIndex = 0;
let answeredCorrectly = false;
let savedWords = [];

document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("savedWords");
  if (stored) savedWords = JSON.parse(stored);

  loadWord();

  document.getElementById("speak-btn").addEventListener("click", speakWord);
  document.getElementById("save-btn").addEventListener("click", saveWord);
  document.getElementById("show-saved-btn").addEventListener("click", showSavedWords);
  document.getElementById("next-btn").addEventListener("click", nextWord);
});

function selectFolder(folderNumber) {
  if (!folders[folderNumber] || folders[folderNumber].length === 0) {
    alert("התיקייה עדיין ריקה.");
    return;
  }

  currentFolder = folderNumber;
  wordsList = folders[currentFolder];
  currentWordIndex = 0;
  loadWord();
}

function speakWord() {
  const word = wordsList[currentWordIndex].word;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function saveWord() {
  const word = wordsList[currentWordIndex].word;
  if (!savedWords.includes(word)) {
    savedWords.push(word);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    alert(`המילה "${word}" נשמרה לרשימת מילים שמורות.`);
  } else {
    alert(`המילה "${word}" כבר קיימת ברשימת מילים שמורות.`);
  }
}

function showSavedWords() {
  const container = document.getElementById("saved-words-container");
  const list = document.getElementById("saved-words-list");
  list.innerHTML = "";

  if (savedWords.length === 0) {
    list.innerHTML = "<li>אין מילים שמורות עדיין.</li>";
  } else {
    savedWords.forEach((word, index) => {
      let wordObj = null;

      // חיפוש המילה בכל התיקיות
      for (const folder of Object.values(folders)) {
        wordObj = folder.find(w => w.word === word);
        if (wordObj) break;
      }

      const translation = wordObj ? wordObj.correct : "";

      const li = document.createElement("li");
      li.textContent = `${word} - ${translation} `;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌ הסר";
      removeBtn.addEventListener("click", () => {
        savedWords.splice(index, 1);
        localStorage.setItem("savedWords", JSON.stringify(savedWords));
        showSavedWords();
      });

      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }

  container.classList.remove("hidden");
}

function closeSavedWords() {
  document.getElementById("saved-words-container").classList.add("hidden");
}

function nextWord() {
  if (!answeredCorrectly) {
    alert("עליך לבחור תשובה נכונה קודם.");
    return;
  }

  currentWordIndex++;
  if (currentWordIndex >= wordsList.length) {
    alert("סיימת את כל המילים בתיקייה זו!");
    currentWordIndex = 0;
  }
  loadWord();
}

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

const words = [
  {
    english: "apple",
    hebrewOptions: ["תפוח", "בננה", "חתול", "ספר"],
    correct: "תפוח",
    sentence: "I ate an apple for breakfast."
  },
  {
    english: "run",
    hebrewOptions: ["לרוץ", "לאכול", "לישון", "לשבת"],
    correct: "לרוץ",
    sentence: "Every morning, I run in the park."
  },
  {
    english: "book",
    hebrewOptions: ["מיטה", "שולחן", "ספר", "מחשב"],
    correct: "ספר",
    sentence: "She read a great book last night."
  }
];

let currentWordIndex = 0;
let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

function showWord() {
  const wordObj = words[currentWordIndex];
  document.getElementById("english-word").innerText = wordObj.english;

  // משפט עם רווח במקום המילה
  const blankSentence = wordObj.sentence.replace(wordObj.english, "_____");
  document.getElementById("sentence").innerText = blankSentence;

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  wordObj.hebrewOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "option-button";
    btn.onclick = () => checkAnswer(option);
    container.appendChild(btn);
  });

  document.getElementById("feedback").innerText = "";
  displaySavedWords();
}

function checkAnswer(selected) {
  const wordObj = words[currentWordIndex];
  const feedback = document.getElementById("feedback");
  if (selected === wordObj.correct) {
    feedback.innerText = "נכון!";
    feedback.style.color = "green";
  } else {
    feedback.innerText = "לא נכון";
    feedback.style.color = "red";
  }
  setTimeout(() => {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    showWord();
  }, 1000);
}

function saveWord() {
  const wordObj = words[currentWordIndex];
  if (!savedWords.includes(wordObj.english)) {
    savedWords.push(wordObj.english);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    alert("המילה נשמרה!");
    displaySavedWords();
  } else {
    alert("המילה כבר שמורה.");
  }
}

function removeSavedWord() {
  const wordObj = words[currentWordIndex];
  const index = savedWords.indexOf(wordObj.english);
  if (index !== -1) {
    savedWords.splice(index, 1);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    alert("המילה הוסרה מהרשימה.");
    displaySavedWords();
  } else {
    alert("המילה לא קיימת ברשימת מילים שמורות.");
  }
}

function speakWord() {
  const wordObj = words[currentWordIndex];
  const utterance = new SpeechSynthesisUtterance(wordObj.english);
  speechSynthesis.speak(utterance);
}

function displaySavedWords() {
  const list = document.getElementById("saved-words-list");
  list.innerHTML = "";
  savedWords.forEach(word => {
    const li = document.createElement("li");
    li.innerText = word;
    list.appendChild(li);
  });
}

// התחלה
document.getElementById("next-button").addEventListener("click", () => {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  showWord();
});

showWord();

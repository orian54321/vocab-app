let folders = {};
let currentFolder = 1;
let wordsList = [];
let currentWordIndex = 0;
let answeredCorrectly = false;
let savedWords = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('words.json')
    .then(response => response.json())
    .then(data => {
      folders = data;
      createFolderButtons();
      const stored = localStorage.getItem("savedWords");
      if (stored) savedWords = JSON.parse(stored);
      selectFolder(1);
    });

  document.getElementById("speak-btn").addEventListener("click", speakWord);
  document.getElementById("save-btn").addEventListener("click", saveWord);
  document.getElementById("show-saved-btn").addEventListener("click", showSavedWords);
  document.getElementById("next-btn").addEventListener("click", nextWord);
});

function createFolderButtons() {
  const folderButtonsDiv = document.getElementById("folder-buttons");
  folderButtonsDiv.innerHTML = "";
  const folderNumbers = Object.keys(folders).map(Number).sort((a, b) => a - b);
  folderNumbers.forEach(folderNumber => {
    const button = document.createElement("button");
    button.textContent = `📂 תיקייה ${folderNumber}`;
    button.addEventListener("click", () => selectFolder(folderNumber));
    folderButtonsDiv.appendChild(button);
  });
}

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
        showSavedWords
::contentReference[oaicite:7]{index=7}
 

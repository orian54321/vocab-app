let currentWords = [];
let currentIndex = 0;
let currentWord = null;
let currentFolder = 'folder1.json';

document.addEventListener("DOMContentLoaded", () => {
  loadWords(currentFolder);

  document.getElementById("folderSelect").addEventListener("change", (e) => {
    currentFolder = e.target.value;
    loadWords(currentFolder);
  });
});

function loadWords(folder) {
  fetch(folder)
    .then((res) => res.json())
    .then((data) => {
      currentWords = data;
      currentIndex = 0;
      showQuestion();
    });
}

function showQuestion() {
  currentWord = currentWords[currentIndex];
  document.getElementById("word").textContent = currentWord.english;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  currentWord.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(answer) {
  if (answer === currentWord.hebrew) {
    alert("נכון!");
  } else {
    alert("לא נכון. התשובה הנכונה היא: " + currentWord.hebrew);
  }

  currentIndex++;
  if (currentIndex < currentWords.length) {
    showQuestion();
  } else {
    alert("סיימת את כל המילים בתיקייה הזו!");
  }
}

function saveWord() {
  if (!currentWord) return;

  let savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');

  if (!savedWords.some(w => w.english === currentWord.english)) {
    savedWords.push(currentWord);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    alert('המילה נשמרה!');
  } else {
    alert('המילה כבר נשמרה קודם.');
  }
}

function loadSavedWords() {
  let savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');

  if (savedWords.length === 0) {
    alert('אין מילים שמורות לתרגול.');
    return;
  }

  currentWords = savedWords;
  currentIndex = 0;
  showQuestion();
}

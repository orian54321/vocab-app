let words = JSON.parse(localStorage.getItem("words")) || [];
let currentIndex = 0;

function saveWords() {
  const input = document.getElementById("words-input").value;
  const lines = input.split("\n");
  lines.forEach(line => {
    const parts = line.split("-");
    if (parts.length === 3) {
      const word = {
        english: parts[0].trim(),
        hebrew: parts[1].trim(),
        sentence: parts[2].trim()
      };
      words.push(word);
    }
  });
  localStorage.setItem("words", JSON.stringify(words));
  alert("המילים נשמרו!");
  document.getElementById("words-input").value = "";
  startQuiz();
}

function startQuiz() {
  document.getElementById("input-section").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= words.length) {
    alert("סיימת את כל המילים!");
    return;
  }

  const word = words[currentIndex];
  document.getElementById("quiz-word").innerText = word.english;

  const correct = word.hebrew;
  const options = [correct];
  while (options.length < 4) {
    const rand = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(rand.hebrew)) {
      options.push(rand.hebrew);
    }
  }

  options.sort(() => Math.random() - 0.5);
  const quizOptions = document.getElementById("quiz-options");
  quizOptions.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, correct);
    quizOptions.appendChild(btn);
  });

  const sentenceWithBlank = word.sentence.replace(word.english, "_____");
  document.getElementById("quiz-sentence").innerText = sentenceWithBlank;
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    alert("צדקת!");
    currentIndex++;
    localStorage.setItem("currentIndex", currentIndex);
    showQuestion();
  } else {
    alert("טעית, נסה שוב.");
  }
}

function playAudio() {
  const word = words[currentIndex];
  const utterance = new SpeechSynthesisUtterance(word.english);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function saveWord() {
  alert("(כאן בעתיד תתווסף פונקציה לשמירת מילה לתיקיית מילים שמורות)");
}

// המשך מהמקום האחרון
window.onload = () => {
  const savedIndex = localStorage.getItem("currentIndex");
  if (savedIndex) currentIndex = parseInt(savedIndex);
};

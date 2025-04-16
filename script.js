let words = JSON.parse(localStorage.getItem("words")) || [];
let currentIndex = parseInt(localStorage.getItem("currentIndex")) || 0;

function generateSentence(word) {
  const templates = [
    `I like to use the word "${word}" every day.`,
    `Can you spell the word "${word}"?`,
    `The word "${word}" is very useful.`,
    `Do you know what "${word}" means?`,
    `Let’s practice using "${word}" in a sentence.`
  ];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

function saveWord() {
  const english = document.getElementById("english-word").value.trim();
  const hebrew = document.getElementById("hebrew-word").value.trim();
  let sentence = document.getElementById("example-sentence").value.trim();

  if (!english || !hebrew) {
    alert("יש להזין מילה באנגלית ותרגום לעברית.");
    return;
  }

  if (!sentence) {
    sentence = generateSentence(english);
  }

  const word = { english, hebrew, sentence };
  words.push(word);
  localStorage.setItem("words", JSON.stringify(words));
  alert("המילה נשמרה!");

  // איפוס השדות
  document.getElementById("english-word").value = "";
  document.getElementById("hebrew-word").value = "";
  document.getElementById("example-sentence").value = "";

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
  while (options.length < 4 && words.length >= 4) {
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

function saveToFolder() {
  alert("(כאן בעתיד תתווסף פונקציה לשמירת מילה לתיקיית מילים שמורות)");
}

window.onload = () => {
  if (words.length > 0) {
    const savedIndex = localStorage.getItem("currentIndex");
    if (savedIndex) currentIndex = parseInt(savedIndex);
    startQuiz();
  }
};

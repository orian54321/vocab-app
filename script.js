const words = [
  {
    english: "apple",
    hebrewOptions: ["תפוח", "בננה", "חתול", "ספר"],
    correct: "תפוח",
    sentence: "I ate an _____ for breakfast."
  },
  {
    english: "run",
    hebrewOptions: ["לרוץ", "לאכול", "לישון", "לשבת"],
    correct: "לרוץ",
    sentence: "Every morning, I _____ in the park."
  },
  {
    english: "book",
    hebrewOptions: ["מיטה", "שולחן", "ספר", "מחשב"],
    correct: "ספר",
    sentence: "She read a great _____ last night."
  }
];

let currentWordIndex = 0;
const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

function showWord() {
  const wordObj = words[currentWordIndex];
  document.getElementById("word").innerText = wordObj.english;
  document.getElementById("sentence").innerText = wordObj.sentence.replace(wordObj.english, "_____");

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  wordObj.hebrewOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("feedback").innerText = "";
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
  } else {
    alert("המילה כבר שמורה.");
  }
}

function speakWord() {
  const wordObj = words[currentWordIndex];
  const utterance = new SpeechSynthesisUtterance(wordObj.english);
  speechSynthesis.speak(utterance);
}

showWord();

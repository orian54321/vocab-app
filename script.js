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
let isCorrectAnswer = false;

function showWord() {
  const wordObj = words[currentWordIndex];
  isCorrectAnswer = false;

  document.getElementById("english-word").innerText = wordObj.english;
  document.getElementById("sentence").innerText = wordObj.sentence;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  wordObj.hebrewOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.classList.add("option-button");
    btn.onclick = () => checkAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("feedback").innerText = "";
  document.getElementById("next-button").disabled = true;
}

function checkAnswer(selected, buttonElement) {
  const wordObj = words[currentWordIndex];
  const feedback = document.getElementById("feedback");

  if (selected === wordObj.correct) {
    feedback.innerText = "צדקת!";
    feedback.style.color = "green";
    isCorrectAnswer = true;
    document.getElementById("next-button").disabled = false;
  } else {
    feedback.innerText = "טעית!";
    feedback.style.color = "red";
    buttonElement.disabled = true; // מבטל את האפשרות ללחוץ שוב על אותה טעות
  }
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

document.getElementById("next-button").addEventListener("click", () => {
  if (!isCorrectAnswer) return;
  currentWordIndex = (currentWordIndex + 1) % words.length;
  showWord();
});

document.getElementById("save-button").addEventListener("click", saveWord);
document.getElementById("speak-button").addEventListener("click", speakWord);

showWord();

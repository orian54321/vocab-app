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
let isCorrectAnswer = false;

const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

function showWord() {
  const wordObj = words[currentWordIndex];
  isCorrectAnswer = false;

  document.getElementById("english-word").innerText = wordObj.english;
  document.getElementById("sentence").innerText = wordObj.sentence.replace(wordObj.english, "_____");

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

function checkAnswer(selected, button) {
  const wordObj = words[currentWordIndex];
  const feedback = document.getElementById("feedback");

  if (selected === wordObj.correct) {
    feedback.innerText = "צדקת!";
    feedback.style.color = "green";
    isCorrectAnswer = true;
    document.getElementById("next-button").disabled = false;

    // מנטרל את כל הכפתורים כדי שלא ילחצו שוב
    const allButtons = document.querySelectorAll(".option-button");
    allButtons.forEach(btn => btn.disabled = true);
  } else {
    feedback.innerText = "טעית!";
    feedback.style.color = "red";
    button.disabled = true; // מבטל את כפתור התשובה השגויה שנבחרה
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
  if (isCorrectAnswer) {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    showWord();
  } else {
    alert("עליך לבחור את התשובה הנכונה לפני שתוכל להמשיך.");
  }
});

document.getElementById("save-button").addEventListener("click", saveWord);
document.getElementById("speak-button").addEventListener("click", speakWord);

showWord();

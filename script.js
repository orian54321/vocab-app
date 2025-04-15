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
let correctSelected = false;

const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

function showWord() {
  correctSelected = false;

  const wordObj = words[currentWordIndex];

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
    correctSelected = true;

    // כפתור "המשך" מופעל רק אחרי תשובה נכונה
    document.getElementById("next-button").disabled = false;

    // מנטרל את כל הכפתורים
    const buttons = document.querySelectorAll(".option-button");
    buttons.forEach(btn => btn.disabled = true);
  } else {
    feedback.innerText = "טעית!";
    feedback.style.color = "red";

    // מבטל רק את הכפתור של התשובה השגויה
    button.disabled = true;
  }
}

function goToNextWord() {
  if (!correctSelected) {
    alert("עליך לבחור את התשובה הנכונה לפני שתוכל להמשיך.");
    return;
  }
  currentWordIndex = (currentWordIndex + 1) % words.length;
  showWord();
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

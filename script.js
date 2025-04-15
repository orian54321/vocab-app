const words = [
  {
    english: "apple",
    hebrewOptions: ["תפוח", "חתול", "כיסא", "מים"],
    correct: "תפוח",
    sentence: "I ate an _____ for breakfast."
  },
  {
    english: "run",
    hebrewOptions: ["לרוץ", "לישון", "לצחוק", "לקרוא"],
    correct: "לרוץ",
    sentence: "Every morning, I _____ in the park."
  },
  {
    english: "book",
    hebrewOptions: ["מחשב", "ספר", "אוכל", "בית"],
    correct: "ספר",
    sentence: "She read a great _____ last night."
  }
];

let currentWordIndex = 0;
const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

const englishWordElem = document.getElementById("english-word");
const sentenceElem = document.getElementById("sentence");
const optionsContainer = document.getElementById("options-container");
const feedbackElem = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const saveButton = document.getElementById("save-button");
const speakButton = document.getElementById("speak-button");

function showWord() {
  const word = words[currentWordIndex];
  englishWordElem.innerText = word.english;
  sentenceElem.innerText = word.sentence.replace(word.english, "_____");
  feedbackElem.innerText = "";
  nextButton.disabled = true;
  optionsContainer.innerHTML = "";

  word.hebrewOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option-button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selected, button) {
  const word = words[currentWordIndex];
  if (selected === word.correct) {
    feedbackElem.innerText = "צדקת!";
    feedbackElem.style.color = "green";
    nextButton.disabled = false;

    // נטרל את כל הכפתורים האחרים
    const allButtons = document.querySelectorAll(".option-button");
    allButtons.forEach(btn => {
      btn.disabled = true;
      if (btn.innerText === word.correct) {
        btn.style.backgroundColor = "#a5d6a7"; // ירוק
      }
    });
  } else {
    feedbackElem.innerText = "טעית.";
    feedbackElem.style.color = "red";
    button.disabled = true;
    button.style.backgroundColor = "#ef9a9a"; // אדום
  }
}

nextButton.addEventListener("click", () => {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  showWord();
});

saveButton.addEventListener("click", () => {
  const word = words[currentWordIndex];
  if (!savedWords.includes(word.english)) {
    savedWords.push(word.english);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    alert("המילה נשמרה!");
  } else {
    alert("המילה כבר שמורה.");
  }
});

speakButton.addEventListener("click", () => {
  const word = words[currentWordIndex];
  const utterance = new SpeechSynthesisUtterance(word.english);
  speechSynthesis.speak(utterance);
});

// התחלה
showWord();

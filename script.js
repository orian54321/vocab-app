const words = [
  {
    english: "dog",
    correct: "כלב",
    options: ["חתול", "דג", "כלב", "עכבר"],
    sentence: "The ___ barked all night."
  },
  {
    english: "house",
    correct: "בית",
    options: ["דלת", "בית", "מדרכה", "בניין"],
    sentence: "We live in a big ___ near the park."
  },
  {
    english: "car",
    correct: "מכונית",
    options: ["מכונית", "מטוס", "אופניים", "רכבת"],
    sentence: "My ___ is red and fast."
  }
];

let currentIndex = 0;

const wordElement = document.getElementById("word");
const optionsElement = document.getElementById("options");
const sentenceElement = document.getElementById("sentence");
const feedbackElement = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

function showQuestion() {
  const word = words[currentIndex];
  wordElement.textContent = word.english;
  sentenceElement.textContent = word.sentence.replace("___", "_____");
  feedbackElement.textContent = "";

  optionsElement.innerHTML = "";
  word.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(option, word.correct);
    optionsElement.appendChild(button);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    feedbackElement.textContent = "✔️ נכון!";
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.textContent = "❌ טעות. נסה שוב!";
    feedbackElement.style.color = "red";
  }
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % words.length;
  showQuestion();
});

document.getElementById("save-btn").addEventListener("click", () => {
  alert("שמירת מילים תתווסף בשלב הבא 🙂");
});

showQuestion();

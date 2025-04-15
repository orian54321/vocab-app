const wordElement = document.getElementById("english-word");
const sentenceElement = document.getElementById("sentence");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const speakBtn = document.getElementById("speak-btn");
const saveBtn = document.getElementById("save-word-btn");

let currentWord = {};
let savedWords = JSON.parse(localStorage.getItem("savedWords") || "[]");

// רשימת מילים לדוגמה בלבד
const words = [
    {
        english: "apple",
        hebrewOptions: ["בננה", "תפוח", "אגס", "שזיף"],
        correct: "תפוח",
        sentence: "I eat an ____ every morning."
    },
    {
        english: "dog",
        hebrewOptions: ["חתול", "ציפור", "כלב", "דג"],
        correct: "כלב",
        sentence: "My ____ loves to play with the ball."
    }
];

function loadWord() {
    feedbackElement.textContent = "";
    nextBtn.disabled = true;
    optionsElement.innerHTML = "";

    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];

    wordElement.textContent = currentWord.english;
    sentenceElement.textContent = currentWord.sentence.replace("____", "_____");

    currentWord.hebrewOptions.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        optionsElement.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if (selected === currentWord.correct) {
        feedbackElement.textContent = "✅ נכון!";
        nextBtn.disabled = false;
    } else {
        feedbackElement.textContent = "❌ לא נכון, נסה שוב.";
    }
}

nextBtn.onclick = loadWord;

speakBtn.onclick = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.english);
    speechSynthesis.speak(utterance);
};

saveBtn.onclick = () => {
    if (!savedWords.includes(currentWord.english)) {
        savedWords.push(currentWord.english);
        localStorage.setItem("savedWords", JSON.stringify(savedWords));
        alert("המילה נשמרה!");
    }
};

loadWord();

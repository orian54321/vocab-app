const wordElement = document.getElementById("english-word");
const sentenceElement = document.getElementById("sentence");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const speakBtn = document.getElementById("speak-btn");
const saveBtn = document.getElementById("save-word-btn");
const savedList = document.getElementById("saved-words-list");

let currentWord = {};
let savedWords = JSON.parse(localStorage.getItem("savedWords") || "[]");

// מילים לדוגמה זמניות
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
        displaySavedWords();
    }
};

function displaySavedWords() {
    savedList.innerHTML = "";
    savedWords.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word + " ";
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "הסר";
        removeBtn.onclick = () => removeSavedWord(word);
        li.appendChild(removeBtn);
        savedList.appendChild(li);
    });
}

function removeSavedWord(word) {
    savedWords = savedWords.filter(w => w !== word);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    displaySavedWords();
}

loadWord();
displaySavedWords();

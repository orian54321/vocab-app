// --- שמירה מקומית ---
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// --- הוספת מילה ---
function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  const sentence = document.getElementById("exampleSentence").value.trim();
  if (!english || !hebrew) {
    alert("יש למלא גם מילה באנגלית וגם בעברית");
    return;
  }
  const example = sentence || `This is a sentence with the word ${english}.`;

  const wordData = { english, hebrew, sentence: example };
  const words = loadFromLocalStorage("words");
  words.push(wordData);
  saveToLocalStorage("words", words);

  alert("המילה נוספה בהצלחה!");
  document.getElementById("englishWord").value = "";
  document.getElementById("hebrewWord").value = "";
  document.getElementById("exampleSentence").value = "";
}

// מעבר לדפים
function goToPractice() {
  window.location.href = "practice.html";
}

function goToSaved() {
  window.location.href = "saved.html";
}

function goBack() {
  window.location.href = "index.html";
}

// תרגול מילים
let currentWord = null;
let remainingWords = [];

function loadPractice() {
  const allWords = loadFromLocalStorage("words");
  if (allWords.length === 0) {
    document.getElementById("practice-container").innerHTML = "<p>אין מילים לתרגול.</p>";
    return;
  }
  remainingWords = [...allWords];
  showNextWord();
}

function showNextWord() {
  document.getElementById("feedback").innerText = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("choices").innerHTML = "";

  if (remainingWords.length === 0) {
    document.getElementById("practice-container").innerHTML = "<p>סיימת את כל המילים!</p><button onclick='goBack()'>חזרה</button>";
    return;
  }

  const index = Math.floor(Math.random() * remainingWords.length);
  currentWord = remainingWords[index];
  remainingWords.splice(index, 1);

  document.getElementById("word").innerText = currentWord.english;

  const choices = generateChoices(currentWord);
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => checkAnswer(choice);
    btn.style.margin = "10px";
    btn.style.display = "block";
    document.getElementById("choices").appendChild(btn);
  });

  const sentenceWithBlank = currentWord.sentence.replace(currentWord.english, "_____");
  document.getElementById("example-sentence").innerText = sentenceWithBlank;
}

function generateChoices(correctWord) {
  const allWords = loadFromLocalStorage("words");
  const incorrect = allWords.filter(w => w.hebrew !== correctWord.hebrew);
  let shuffled = incorrect.sort(() => 0.5 - Math.random()).slice(0, 3);
  shuffled.push(correctWord);
  return shuffled.sort(() => 0.5 - Math.random()).map(w => w.hebrew);
}

function checkAnswer(selected) {
  if (selected === currentWord.hebrew) {
    document.getElementById("feedback").innerText = "✔ נכון!";
    document.getElementById("nextBtn").style.display = "inline-block";
  } else {
    document.getElementById("feedback").innerText = "❌ לא נכון, נסה שוב.";
  }
}

function nextWord() {
  showNextWord();
}

// --- מילים שמורות ---
function saveWord(word) {
  const saved = loadFromLocalStorage("savedWords");
  saved.push(word);
  saveToLocalStorage("savedWords", saved);
  alert("המילה נוספה לתקיית מילים שמורות");
}

function loadSavedWords() {
  const savedWords = loadFromLocalStorage("savedWords");
  const folders = document.getElementById("folders");
  folders.innerHTML = "";

  if (savedWords.length === 0) {
    folders.innerHTML = "<p>אין מילים שמורות</p>";
    return;
  }

  const chunks = [];
  for (let i = 0; i < savedWords.length; i += 50) {
    chunks.push(savedWords.slice(i, i + 50));
  }

  chunks.forEach((chunk, index) => {
    const folderDiv = document.createElement("div");
    folderDiv.style.border = "1px solid gray";
    folderDiv.style.margin = "10px";
    folderDiv.style.padding = "10px";

    const title = document.createElement("h2");
    title.innerText = `מילים שמורות ${index + 1}`;
    folderDiv.appendChild(title);

    chunk.forEach((word, i) => {
      const wordDiv = document.createElement("div");
      wordDiv.innerHTML = `
        <input type="checkbox" id="check-${index}-${i}">
        <b>${word.english}</b> - ${word.hebrew}
        <button onclick="removeSavedWord(${(index * 50) + i})">מחק</button>
      `;
      folderDiv.appendChild(wordDiv);
    });

    folders.appendChild(folderDiv);
  });
}

function removeSavedWord(globalIndex) {
  const saved = loadFromLocalStorage("savedWords");
  saved.splice(globalIndex, 1);
  saveToLocalStorage("savedWords", saved);
  alert("המילה הוסרה");
  location.reload();
}

// טעינה לפי עמוד
if (window.location.pathname.includes("practice.html")) {
  window.onload = loadPractice;
}
if (window.location.pathname.includes("saved.html")) {
  window.onload = loadSavedWords;
}

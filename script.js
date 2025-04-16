// --- פונקציה להוספת מילה חדשה ---
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

  let words = JSON.parse(localStorage.getItem("words")) || [];
  words.push(wordData);
  localStorage.setItem("words", JSON.stringify(words));

  alert("המילה נוספה בהצלחה!");
  document.getElementById("englishWord").value = "";
  document.getElementById("hebrewWord").value = "";
  document.getElementById("exampleSentence").value = "";
}

// --- מעבר בין מסכים ---
function goToPractice() {
  window.location.href = "practice.html";
}

function goToSaved() {
  window.location.href = "saved.html";
}

function goBack() {
  window.location.href = "index.html";
}

// --- תרגול ---
let currentWord = null;
let remainingWords = [];

function loadPractice() {
  const allWords = JSON.parse(localStorage.getItem("words")) || [];

  if (allWords.length === 0) {
    document.getElementById("practice-container").innerHTML = "<p>אין מילים לתרגול. חזור להזנה.</p>";
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
  const allWords = JSON.parse(localStorage.getItem("words")) || [];
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

// --- קריאת המילה באנגלית ---
function speakWord() {
  if (!currentWord) return;

  const utterance = new SpeechSynthesisUtterance(currentWord.english);
  utterance.lang = "en-US";
  utterance.pitch = 1; // גובה קול רגיל
  utterance.rate = 1;  // קצב דיבור רגיל

  // בחירת קול נשי אם קיים
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice =>
    voice.lang.startsWith("en") &&
    voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman")
  );
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  speechSynthesis.speak(utterance);
}

// --- טעינה אוטומטית במסך התרגול ---
if (window.location.pathname.includes("practice.html")) {
  window.onload = () => {
    // יש לדחות טעינת קולות עד שיהיו זמינים
    window.speechSynthesis.onvoiceschanged = () => {
      loadPractice();
    };
  };
}

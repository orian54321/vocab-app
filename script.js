// --- יצירת משפט חכם אוטומטי ---
function generateSmartSentence(word) {
  return `Here is an example sentence using the word "${word}" in context.`;
}

// --- פונקציה להוספת מילה חדשה ---
function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  const sentence = document.getElementById("exampleSentence").value.trim();

  if (!english || !hebrew) {
    alert("יש למלא גם מילה באנגלית וגם בעברית");
    return;
  }

  const example = sentence || generateSmartSentence(english);

  const wordData = {
    english,
    hebrew,
    sentence: example
  };

  let words = JSON.parse(localStorage.getItem("words")) || [];
  words.push(wordData);
  localStorage.setItem("words", JSON.stringify(words));

  alert("המילה נוספה בהצלחה!");
  document.getElementById("englishWord").value = "";
  document.getElementById("hebrewWord").value = "";
  document.getElementById("exampleSentence").value = "";
}

// --- ייבוא מקובץ Excel ---
function importFromExcel() {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];

  if (!file) {
    alert("אנא בחר קובץ Excel");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let words = JSON.parse(localStorage.getItem("words")) || [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0] || !row[1]) continue;

      const wordData = {
        english: row[0].toString().trim(),
        hebrew: row[1].toString().trim(),
        sentence: row[2] ? row[2].toString().trim() : generateSmartSentence(row[0].toString().trim())
      };

      words.push(wordData);
    }

    localStorage.setItem("words", JSON.stringify(words));
    alert("המילים נוספו בהצלחה!");
  };

  reader.readAsArrayBuffer(file);
}

// --- פונקציות ניווט ---
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

// --- שמירת מילה מתוך התרגול ---
function saveCurrentWord() {
  if (!currentWord) return;
  let words = JSON.parse(localStorage.getItem("words")) || [];
  words.push(currentWord);
  localStorage.setItem("words", JSON.stringify(words));
  alert("המילה נשמרה!");
}

// --- השמעה ---
function speakWord() {
  if (!currentWord) return;
  const msg = new SpeechSynthesisUtterance(currentWord.english);
  msg.lang = "en-US";
  msg.voice = speechSynthesis.getVoices().find(voice => voice.name.includes("Female") || voice.name.includes("Samantha")) || speechSynthesis.getVoices()[0];
  msg.rate = 1;
  speechSynthesis.speak(msg);
}

// --- טעינה למסך תרגול ---
if (window.location.pathname.includes("practice.html")) {
  window.onload = () => {
    setTimeout(() => {
      loadPractice();
    }, 500);
  };
}

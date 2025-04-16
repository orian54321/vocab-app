// --- ייבוא מילים מקובץ Excel ---
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
        sentence: row[2] ? row[2].toString().trim() : `This is a sentence with the word ${row[0].toString().trim()}.`
      };

      words.push(wordData);
    }

    localStorage.setItem("words", JSON.stringify(words));
    alert("המילים נוספו בהצלחה!");
  };

  reader.readAsArrayBuffer(file);
}

// --- פונקציה להוספת מילה חדשה ידנית ---
function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  const sentence = document.getElementById("exampleSentence").value.trim();

  if (!english || !hebrew) {
    alert("יש למלא גם מילה באנגלית וגם בעברית");
    return;
  }

  const example = sentence || `This is a sentence with the word ${english}.`;

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

// --- השמעת מילה ---
function speakWord() {
  if (!currentWord) return;

  const utterance = new SpeechSynthesisUtterance(currentWord.english);
  utterance.lang = 'en-US';
  utterance.rate = 1; // קצב רגיל

  // חיפוש קול נשי אם אפשר
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.toLowerCase().includes('female'));
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// --- שמירת מילה נוכחית ---
function saveCurrentWord() {
  if (!currentWord) return;

  let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

  // בדיקה אם כבר קיימת
  const alreadyExists = savedWords.some(w => w.english === currentWord.english && w.hebrew === currentWord.hebrew);
  if (!alreadyExists) {
    savedWords.push(currentWord);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    alert("המילה נוספה לרשימת מילים שמורות!");
  } else {
    alert("המילה כבר קיימת ברשימת מילים שמורות.");
  }
}

// --- טוען את התרגול רק אם זה המסך הנוכחי ---
if (window.location.pathname.includes("practice.html")) {
  window.onload = loadPractice;
}

// --- טוען מילים שמורות אם זה saved.html ---
if (window.location.pathname.includes("saved.html")) {
  window.onload = function () {
    const container = document.getElementById("savedWordsList");
    const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

    if (!savedWords.length) {
      container.innerHTML = "<p>אין מילים שמורות.</p>";
      return;
    }

    savedWords.forEach((word, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${word.english}</strong> - ${word.hebrew}<br><em>${word.sentence}</em></p>
        <button onclick="deleteSavedWord(${index})">❌ מחק</button>
        <hr>
      `;
      container.appendChild(div);
    });
  };
}

function deleteSavedWord(index) {
  let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];
  savedWords.splice(index, 1);
  localStorage.setItem("savedWords", JSON.stringify(savedWords));
  location.reload(); // טוען מחדש את הדף כדי לעדכן את הרשימה
}

// טעינת מילים מה-localStorage
let words = JSON.parse(localStorage.getItem("words")) || [];
let currentWord = null;

// הוספת מילה חדשה
function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  let example = document.getElementById("exampleSentence").value.trim();

  if (!english || !hebrew) {
    alert("נא למלא את שני השדות: מילה באנגלית ותרגום לעברית.");
    return;
  }

  if (!example) {
    example = `I like the word "${english}" in a sentence.`;
  }

  const newWord = { english, hebrew, example };
  words.push(newWord);
  localStorage.setItem("words", JSON.stringify(words));
  alert("המילה נוספה בהצלחה!");

  document.getElementById("englishWord").value = "";
  document.getElementById("hebrewWord").value = "";
  document.getElementById("exampleSentence").value = "";
}

// ייבוא מקובץ Excel
function importFromExcel() {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];
  if (!file) {
    alert("בחר קובץ Excel תחילה.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 1; i < rows.length; i++) {
      const [english, hebrew, example] = rows[i];
      if (english && hebrew) {
        words.push({
          english: english.trim(),
          hebrew: hebrew.trim(),
          example: example ? example.trim() : `I like the word "${english}" in a sentence.`
        });
      }
    }

    localStorage.setItem("words", JSON.stringify(words));
    alert("הייבוא הסתיים בהצלחה!");
    fileInput.value = "";
  };

  reader.readAsArrayBuffer(file);
}

// מעבר בין דפים
function goToPractice() {
  window.location.href = "practice.html";
}

function goToSaved() {
  window.location.href = "saved.html";
}

function goBack() {
  window.location.href = "index.html";
}

// בדיקת קיום מילה
function checkIfWordExists() {
  const input = document.getElementById("checkWord");
  const result = document.getElementById("checkResult");
  const wordToCheck = input.value.trim().toLowerCase();

  if (!wordToCheck) {
    result.textContent = "נא להזין מילה לבדיקה.";
    result.style.color = "black";
    return;
  }

  const exists = words.some(w => w.english.toLowerCase() === wordToCheck);

  if (exists) {
    result.textContent = "המילה שמורה.";
    result.style.color = "green";
  } else {
    result.textContent = "המילה אינה שמורה.";
    result.style.color = "red";
  }
}

// תרגול - טעינת מילה אקראית
function loadPracticeWords() {
  if (words.length === 0) {
    document.getElementById("practice-container").innerHTML = "<p>אין מילים לתרגול.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];

  // הצגת המילה באנגלית
  document.getElementById("word").textContent = currentWord.english;

  // יצירת אפשרויות תרגום
  const choices = [currentWord.hebrew];
  while (choices.length < 4 && words.length > 1) {
    const randomChoice = words[Math.floor(Math.random() * words.length)].hebrew;
    if (!choices.includes(randomChoice)) {
      choices.push(randomChoice);
    }
  }

  shuffleArray(choices);

  // הצגת הכפתורים
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });

  // משפט עם מקום ריק
  const sentence = currentWord.example.replace(new RegExp(currentWord.english, "gi"), "_____");
  document.getElementById("example-sentence").textContent = sentence;

  // ניקוי פידבק
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
}

// בדיקת תשובה
function checkAnswer(selected) {
  if (selected === currentWord.hebrew) {
    document.getElementById("feedback").textContent = "נכון! ✅";
  } else {
    document.getElementById("feedback").textContent = `שגוי. התשובה הנכונה היא: ${currentWord.hebrew}`;
  }

  document.getElementById("nextBtn").style.display = "inline-block";
}

// מעבר למילה הבאה
function nextWord() {
  loadPracticeWords();
}

// שמירת מילה נוכחית לרשימת מילים שמורות
function saveCurrentWord() {
  if (!currentWord) return;

  let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

  if (!savedWords.some(w => w.english === currentWord.english)) {
    savedWords.push(currentWord);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
    alert("המילה נוספה לרשימת מילים שמורות!");
  } else {
    alert("המילה כבר קיימת ברשימת מילים שמורות.");
  }
}

// השמעת מילה באנגלית
function speakWord() {
  if (!currentWord) return;

  const utterance = new SpeechSynthesisUtterance(currentWord.english);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.voice = speechSynthesis.getVoices().find(v => v.lang === "en-US" && v.name.includes("Female")) || null;
  speechSynthesis.speak(utterance);
}

// ערבוב מערך (לשאלות)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[array[i], array[j]] = [array[j], array[i]];
  }
}

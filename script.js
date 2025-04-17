let words = JSON.parse(localStorage.getItem("words")) || [];
let currentWord = null;

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
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
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

function goToPractice() {
  window.location.href = "practice.html";
}
function goToSaved() {
  window.location.href = "saved.html";
}
function goBack() {
  window.location.href = "index.html";
}

function checkIfWordExists() {
  const wordToCheck = document.getElementById("checkWord").value.trim().toLowerCase();
  const result = document.getElementById("checkResult");
  const exists = words.some(w => w.english.toLowerCase() === wordToCheck);
  result.textContent = exists ? "המילה שמורה." : "המילה אינה שמורה.";
  result.style.color = exists ? "green" : "red";
}

function loadPracticeWords() {
  if (words.length === 0) {
    document.getElementById("practice-container").innerHTML = "<p>אין מילים לתרגול.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];

  document.getElementById("word").textContent = currentWord.english;

  const choices = [currentWord.hebrew];
  while (choices.length < 4 && words.length > 1) {
    const randomChoice = words[Math.floor(Math.random() * words.length)].hebrew;
    if (!choices.includes(randomChoice)) {
      choices.push(randomChoice);
    }
  }

  shuffleArray(choices);
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("example-sentence").textContent =
    currentWord.example.replace(new RegExp(currentWord.english, "gi"), "_____");
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
}

function checkAnswer(selected) {
  const feedback = document.getElementById("feedback");
  if (selected === currentWord.hebrew) {
    feedback.textContent = "נכון! ✅";
  } else {
    feedback.textContent = `שגוי. התשובה הנכונה היא: ${currentWord.hebrew}`;
  }
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextWord() {
  loadPracticeWords();
}

function saveCurrentWord() {
  if (!currentWord) return;

  for (let i = 1; i <= 30; i++) {
    const key = `savedWordsFolder${i}`;
    let folder = JSON.parse(localStorage.getItem(key)) || [];

    if (folder.some(w => w.english === currentWord.english)) {
      alert("המילה כבר קיימת ברשימת מילים שמורות.");
      return;
    }

    if (folder.length < 50) {
      folder.push(currentWord);
      localStorage.setItem(key, JSON.stringify(folder));
      alert("המילה נוספה לתיקייה שמורה.");
      return;
    }
  }

  alert("כל התיקיות מלאות (30 תיקיות של 50 מילים).");
}

function speakWord() {
  if (!currentWord) return;

  const utterance = new SpeechSynthesisUtterance(currentWord.english);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.voice = speechSynthesis.getVoices().find(v => v.lang === "en-US" && v.name.includes("Female")) || null;
  speechSynthesis.speak(utterance);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

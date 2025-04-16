let currentWordIndex = 0;
let currentWord = null;
let words = JSON.parse(localStorage.getItem("words")) || [];
let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];
let practiceList = [];

function goBack() {
  window.location.href = "index.html";
}

function goToSaved() {
  window.location.href = "saved.html";
}

function goToPractice() {
  window.location.href = "practice.html";
}

function speakWord() {
  if (!currentWord) return;
  const utterance = new SpeechSynthesisUtterance(currentWord.english);
  utterance.lang = "en-US";
  utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("Female")) || null;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

async function generateSmartSentence(word) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_trg=${encodeURIComponent(word)}&max=1`);
    const data = await response.json();
    const related = data.length > 0 ? data[0].word : "context";
    return `This sentence includes the word ___ and its context: ${related}.`;
  } catch (e) {
    return `This is a sentence with the word ___.`;
  }
}

async function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  const sentenceInput = document.getElementById("exampleSentence").value.trim();

  if (!english || !hebrew) {
    alert("נא להזין גם מילה באנגלית וגם בעברית");
    return;
  }

  const sentence = sentenceInput || await generateSmartSentence(english);
  const wordData = { english, hebrew, sentence };
  words.push(wordData);
  localStorage.setItem("words", JSON.stringify(words));

  document.getElementById("englishWord").value = "";
  document.getElementById("hebrewWord").value = "";
  document.getElementById("exampleSentence").value = "";

  alert("המילה נוספה בהצלחה!");
}

function saveCurrentWord() {
  if (!currentWord) return;
  savedWords.push(currentWord);
  localStorage.setItem("savedWords", JSON.stringify(savedWords));
  alert("המילה נשמרה!");
}

function showWord(wordList) {
  if (wordList.length === 0) {
    document.getElementById("practice-container").innerHTML = "<p>לא נמצאו מילים לתרגול.</p>";
    return;
  }

  currentWordIndex = Math.floor(Math.random() * wordList.length);
  currentWord = wordList[currentWordIndex];

  document.getElementById("word").textContent = currentWord.english;
  document.getElementById("example-sentence").textContent = currentWord.sentence.replace(currentWord.english, "___");

  const choices = [currentWord.hebrew];
  while (choices.length < 4 && words.length >= 4) {
    const rand = words[Math.floor(Math.random() * words.length)];
    if (!choices.includes(rand.hebrew)) choices.push(rand.hebrew);
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

  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
}

function checkAnswer(choice) {
  const feedback = document.getElementById("feedback");
  if (choice === currentWord.hebrew) {
    feedback.textContent = "נכון!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `שגוי. התשובה הנכונה היא: ${currentWord.hebrew}`;
    feedback.style.color = "red";
  }
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextWord() {
  showWord(practiceList);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadPracticeWords(fromSaved = false) {
  practiceList = fromSaved ? savedWords : words;
  showWord(practiceList);
}

async function importFromExcel() {
  const fileInput = document.getElementById("excelFile");
  const file = fileInput.files[0];
  if (!file) {
    alert("נא לבחור קובץ Excel");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0] || !row[1]) continue;

      const english = row[0].toString().trim();
      const hebrew = row[1].toString().trim();
      const sentence = row[2] ? row[2].toString().trim() : await generateSmartSentence(english);

      words.push({ english, hebrew, sentence });
    }

    localStorage.setItem("words", JSON.stringify(words));
    alert("הייבוא הסתיים בהצלחה!");
  };
  reader.readAsArrayBuffer(file);
}

// הוסף את המפתח שלך כאן:
const OPENAI_API_KEY = "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";

async function generateExampleSentence(word) {
  const prompt = `Write a grammatically correct English sentence using the word "${word}", and replace the word with a blank (____). Example format: "He went to the ____ to buy some books."`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || `This is a sentence with the word ${word}.`;
  } catch (error) {
    console.error("Error generating sentence:", error);
    return `This is a sentence with the word ${word}.`;
  }
}

async function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  let sentence = document.getElementById("exampleSentence").value.trim();

  if (!english || !hebrew) {
    alert("נא להזין מילה באנגלית ותרגום לעברית.");
    return;
  }

  if (!sentence) {
    sentence = await generateExampleSentence(english);
  }

  const word = { english, hebrew, sentence };
  let words = JSON.parse(localStorage.getItem("words")) || [];
  words.push(word);
  localStorage.setItem("words", JSON.stringify(words));
  alert("המילה נוספה!");

  // ניקוי שדות
  document.getElementById("englishWord").value = "";
  document.getElementById("hebrewWord").value = "";
  document.getElementById("exampleSentence").value = "";
}

async function importFromExcel() {
  const fileInput = document.getElementById("excelFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("אנא בחר קובץ Excel");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let words = JSON.parse(localStorage.getItem("words")) || [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0] || !row[1]) continue;

      const english = row[0].toString().trim();
      const hebrew = row[1].toString().trim();
      let sentence = row[2] ? row[2].toString().trim() : "";

      if (!sentence) {
        sentence = await generateExampleSentence(english);
      }

      words.push({ english, hebrew, sentence });
    }

    localStorage.setItem("words", JSON.stringify(words));
    alert("המילים נוספו בהצלחה!");
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

// ================= תרגול =================

let currentWordIndex = 0;
let words = [];
let shuffledWords = [];

function loadPracticeWords() {
  words = JSON.parse(localStorage.getItem("words")) || [];
  shuffledWords = [...words];
  shuffleArray(shuffledWords);
  currentWordIndex = 0;
  showWord();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showWord() {
  if (currentWordIndex >= shuffledWords.length) {
    document.getElementById("word").textContent = "סיימת את כל המילים!";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("example-sentence").textContent = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("nextBtn").style.display = "none";
    return;
  }

  const word = shuffledWords[currentWordIndex];
  document.getElementById("word").textContent = word.english;
  document.getElementById("example-sentence").textContent = word.sentence;

  const choices = [word.hebrew];
  while (choices.length < 4 && words.length >= 4) {
    const rand = words[Math.floor(Math.random() * words.length)].hebrew;
    if (!choices.includes(rand)) choices.push(rand);
  }

  shuffleArray(choices);

  document.getElementById("choices").innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice, word.hebrew);
    document.getElementById("choices").appendChild(btn);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
}

function checkAnswer(selected, correct) {
  const feedback = document.getElementById("feedback");
  if (selected === correct) {
    feedback.textContent = "נכון!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `לא נכון. התשובה היא: ${correct}`;
    feedback.style.color = "red";
  }
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextWord() {
  currentWordIndex++;
  showWord();
}

function speakWord() {
  const word = shuffledWords[currentWordIndex].english;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes("Female") || voice.name.includes("Samantha")) || speechSynthesis.getVoices()[0];
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

function saveCurrentWord() {
  const word = shuffledWords[currentWordIndex];
  let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];
  savedWords.push(word);
  localStorage.setItem("savedWords", JSON.stringify(savedWords));
  alert("המילה נשמרה!");
}

// טען תרגול כשהמסך הוא practice
if (window.location.pathname.includes("practice.html")) {
  window.onload = loadPracticeWords;
}

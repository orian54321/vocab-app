let currentWord = null;

document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.endsWith("index.html") || location.pathname === "/" || location.pathname.endsWith("/")) {
    document.getElementById("addWordForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const word = document.getElementById("wordInput").value.trim();
      const translation = document.getElementById("translationInput").value.trim();
      let sentence = document.getElementById("sentenceInput").value.trim();

      if (!sentence) {
        sentence = await generateSmartSentence(word);
      }

      const newWord = { word, translation, sentence };
      const words = JSON.parse(localStorage.getItem("words")) || [];
      words.push(newWord);
      localStorage.setItem("words", JSON.stringify(words));
      alert("המילה נוספה בהצלחה!");
      e.target.reset();
    });
  }

  if (location.pathname.endsWith("practice.html")) {
    showPractice();
  }

  if (location.pathname.endsWith("saved.html")) {
    displaySavedWords();
  }
});

function getWords() {
  return JSON.parse(localStorage.getItem("words")) || [];
}

function getSavedWords() {
  return JSON.parse(localStorage.getItem("savedWords")) || [];
}

function saveCurrentWord() {
  if (!currentWord) return;
  let saved = getSavedWords();
  if (!saved.find(w => w.word === currentWord.word)) {
    saved.push(currentWord);
    localStorage.setItem("savedWords", JSON.stringify(saved));
    alert("המילה נשמרה!");
  } else {
    alert("המילה כבר שמורה.");
  }
}

function speakWord() {
  if (!currentWord) return;
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

async function generateSmartSentence(word) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_trg=${word}`);
    const data = await response.json();
    const related = data[0]?.word || "example";
    return `This is a sentence using the word "${word}" with "${related}".`;
  } catch (e) {
    return `This is a sentence with the word "${word}".`;
  }
}

async function showPractice() {
  const words = getWords();
  if (words.length === 0) {
    document.getElementById("question").innerText = "אין מילים לתרגל.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  const wordObj = words[randomIndex];
  currentWord = wordObj;

  const correct = wordObj.translation;
  const options = [correct];
  while (options.length < 4) {
    const w = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(w.translation)) options.push(w.translation);
  }

  options.sort(() => Math.random() - 0.5);
  document.getElementById("question").innerText = `מה התרגום למילה: ${wordObj.word}?`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      alert(opt === correct ? "נכון!" : `לא נכון. התשובה היא: ${correct}`);
      showPractice();
    };
    optionsDiv.appendChild(btn);
  });

  const sentenceDiv = document.getElementById("sentence");
  sentenceDiv.innerText = wordObj.sentence ? `משפט: ${wordObj.sentence}` : `משפט: ${await generateSmartSentence(wordObj.word)}`;
}

function displaySavedWords() {
  const container = document.getElementById("foldersContainer");
  const saved = getSavedWords();
  container.innerHTML = "";

  const folders = [];
  for (let i = 0; i < saved.length; i += 50) {
    folders.push(saved.slice(i, i + 50));
  }

  folders.forEach((folder, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>תיקייה ${index + 1}</h3>`;
    folder.forEach((entry, i) => {
      const wordLine = document.createElement("div");
      wordLine.innerHTML = `<b>${entry.word}</b> - ${entry.translation}<br><i>${entry.sentence}</i>`;
      const delBtn = document.createElement("button");
      delBtn.innerText = "❌ מחק";
      delBtn.onclick = () => {
        const updated = getSavedWords().filter(w => w.word !== entry.word);
        localStorage.setItem("savedWords", JSON.stringify(updated));
        displaySavedWords();
      };
      wordLine.appendChild(delBtn);
      div.appendChild(wordLine);
      div.appendChild(document.createElement("hr"));
    });
    container.appendChild(div);
  });
}

// טעינת מילים מה-localStorage
let words = JSON.parse(localStorage.getItem("words")) || [];

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

  // ניקוי שדות
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

// מעבר לתרגול
function goToPractice() {
  window.location.href = "practice.html";
}

// מעבר למילים שמורות
function goToSaved() {
  window.location.href = "saved.html";
}

// בדיקת קיום מילה במערכת
document.addEventListener("DOMContentLoaded", () => {
  const checkInput = document.getElementById("checkWord");
  const resultPara = document.getElementById("checkResult");

  if (checkInput) {
    checkInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const wordToCheck = checkInput.value.trim().toLowerCase();
        if (!wordToCheck) {
          resultPara.textContent = "נא להזין מילה לבדיקה.";
          resultPara.style.color = "black";
          return;
        }

        const exists = words.some(w => w.english.toLowerCase() === wordToCheck);

        if (exists) {
          resultPara.textContent = "המילה שמורה.";
          resultPara.style.color = "green";
        } else {
          resultPara.textContent = "המילה אינה שמורה.";
          resultPara.style.color = "red";
        }
      }
    });
  }
});

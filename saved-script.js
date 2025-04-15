// קבלת הפנייה לרשימה בדף saved.html
const savedList = document.getElementById("saved-words-list");

// טעינת רשימת המילים השמורות מ-localStorage
let savedWords = JSON.parse(localStorage.getItem("savedWords") || "[]");

// פונקציה להצגת המילים השמורות
function displaySavedWords() {
  savedList.innerHTML = "";
  savedWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word + " ";
    // כפתור להסרת המילה מהרשימה
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "הסר";
    removeBtn.onclick = () => removeSavedWord(word);
    li.appendChild(removeBtn);
    savedList.appendChild(li);
  });
}

// פונקציה להסרת מילה מהרשימה השמורה
function removeSavedWord(word) {
  savedWords = savedWords.filter(w => w !== word);
  localStorage.setItem("savedWords", JSON.stringify(savedWords));
  displaySavedWords();
}

displaySavedWords();

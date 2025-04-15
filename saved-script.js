// קבלת הפנייה לרשימת המילים מהדף saved.html
const savedList = document.getElementById('saved-words-list');

// טעינת המילים השמורות מ-localStorage
let savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');

function displaySavedWords() {
  savedList.innerHTML = '';
  savedWords.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word + ' ';
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'הסר';
    removeBtn.onclick = () => removeSavedWord(word);
    li.appendChild(removeBtn);
    savedList.appendChild(li);
  });
}

function removeSavedWord(word) {
  savedWords = savedWords.filter(w => w !== word);
  localStorage.setItem('savedWords', JSON.stringify(savedWords));
  displaySavedWords();
}

displaySavedWords();

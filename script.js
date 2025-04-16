function addWord() {
  const english = document.getElementById("englishWord").value.trim();
  const hebrew = document.getElementById("hebrewWord").value.trim();
  const sentence = document.getElementById("exampleSentence").value.trim();

  if (!english || !hebrew) {
    alert("יש למלא גם מילה באנגלית וגם בעברית");
    return;
  }

  const example = sentence || `This is a sample sentence with the word ${english}.`;

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

function goToPractice() {
  window.location.href = "practice.html";
}

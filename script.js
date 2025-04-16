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
      if (!row[0] || !row[1]) continue; // דורש לפחות אנגלית + תרגום

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

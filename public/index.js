const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");

document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    // ".26.3.....9186574..784.23167....8.69..4.5....8.3...42.6.....9....79.4......57..34";
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    // "3.6.......1.........4..3516..14...7.9.6.9.1.4.9...72..1356..4.........35......8.7"
    // .63....547....6.1....4.5...53....2.7.........8.9....45...6.1....5.2....347....92. 
    // .8.5...7.5...4.9.3.....7.....6.9.84...8.5.3...47.1.2.....4.....4.5.7...9.3...6.2.
    // 9.2....741..97..68..682.95.4.1..6.9....4.9....2.1..4.6.67.938..51..48..989....5.7
    // 78..65....2........9643....4...72.1.9.......7.6.54...9....5976........9....68..43
  fillpuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  fillpuzzle(textArea.value);
});

function fillpuzzle(data) {
  let len = data.length < 81 ? data.length : 81;
  for (let i = 0; i < len; i++) {
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1; 
    if (!data[i] || data[i] === ".") {
      document.getElementsByClassName(rowLetter + col)[0].innerText = " ";
      continue;
    }
    document.getElementsByClassName(rowLetter + col)[0].innerText = data[i];
  }
  return;
}

async function getSolved() {
  const stuff = {"puzzle": textArea.value}
  const data = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  if (parsed.error) {
    errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
    return
  }
  fillpuzzle(parsed.solution)
}

async function getChecked() {
  const stuff = {"puzzle": textArea.value, "coordinate": coordInput.value, "value": valInput.value}
    const data = await fetch("/api/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
}


document.getElementById("solve-button").addEventListener("click", getSolved)
document.getElementById("check-button").addEventListener("click", getChecked)
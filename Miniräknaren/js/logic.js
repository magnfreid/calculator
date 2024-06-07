const buttons = document.querySelectorAll("button");
const result = document.querySelector("#result");
const inputField = document.querySelector("#input");
const historyList = document.querySelector(".history");

//Lägger till eventlisteners för musklick + tangenter för all knappar
function initButtons() {
  buttons.forEach((button) => {
    if (button.innerText == "C") {
      button.addEventListener("click", () => onClickC());
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          onClickC();
        }
      });
    } else if (button.innerText == "=") {
      button.addEventListener("click", () => onClickSum());
      window.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === "=") {
          onClickSum();
        }
      });
    } else if (button.innerText == "√x") {
      button.addEventListener("click", () => onClickSquareRoot());
    } else if (button.innerText == "x^2") {
      button.addEventListener("click", () => onClickSquare());
    } else if (button.innerText == "Clear") {
      button.addEventListener("click", () => onClickClearHistory());
    } else {
      button.addEventListener("click", () => onClickInput(button.innerText));

      window.addEventListener("keydown", (event) => {
        if (event.key === button.innerText) {
          onClickInput(button.innerText);
        }
      });
    }
  });
  disableOperators();
}

//För knappar 1-9
function onClickInput(inputText) {
  inputField.innerText += inputText;
  storeLocally();
  disableOperators();
}

function onClickSquareRoot() {
  inputField.innerText = `sqrt(${result.innerText})`;
  let answer = Math.sqrt(result.innerText);
  result.innerText = answer;
  addToHistory();
  storeLocally();
  disableOperators();
  inputField.innerText = answer;
}

function onClickSquare() {
  inputField.innerText = `${result.innerText}^2`;
  let answer = parseInt(result.innerText) * parseInt(result.innerText);
  result.innerText = answer;
  addToHistory();
  storeLocally();
  disableOperators();
  inputField.innerText = answer;
}

function onClickC() {
  inputField.innerText = "";
  result.innerText = "";
  storeLocally();
  disableOperators();
}

function onClickSum() {
  const toCalculate = math.compile(inputField.innerText);
  const answer = toCalculate.evaluate();
  result.innerText = answer;
  addToHistory();
  disableOperators();
  storeLocally();
  inputField.innerText = answer;
}

//Skapa nytt li-element bestående av knapp, input + uträkning och lägg till i historik
function addToHistory() {
  const newLiElement = document.createElement("li");
  const newInputString = document.createElement("code");
  const newResultString = document.createElement("code");
  const newButton = document.createElement("button");
  newInputString.innerText = inputField.innerText;
  newResultString.innerText = result.innerText;
  newButton.innerText = "↺";
  newButton.className = "capture-button";
  newButton.addEventListener("click", () => {
    inputField.innerText = newInputString.innerText;
    result.innerText = newResultString.innerText;
    disableOperators();
  });
  newLiElement.appendChild(newButton);
  newLiElement.appendChild(newInputString);
  newLiElement.appendChild(document.createTextNode(" = "));
  newLiElement.appendChild(newResultString);
  newLiElement.className = "history-item";
  historyList.insertBefore(newLiElement, historyList.firstChild);
}

/* Styr vilka knappar som ska vara aktiva. Förhindra att 2 operators trycks in på rad,
rot och x^2 endast aktiva om resultat finns */

function disableOperators() {
  const lastChar = inputField.innerText.charAt(inputField.innerText.length - 1);
  const operators = ["+", "-", "*", "/"];
  const squareOperators = ["√x", "x^2"];
  buttons.forEach((button) => {
    if (
      (inputField.innerText == "" && button.classList.contains("op")) ||
      (operators.includes(lastChar) && button.classList.contains("op"))
    ) {
      button.disabled = true;
    } else if (
      result.innerText == "" &&
      squareOperators.includes(button.innerText)
    ) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  });
}

function onClickClearHistory() {
  while (historyList.firstChild) {
    historyList.removeChild(historyList.firstChild);
  }
  storeLocally();
}

function storeLocally() {
  localStorage.setItem("storedInput", inputField.innerText);
  localStorage.setItem("storedResult", result.innerText);
  localStorage.setItem("storedHistory", historyList.innerHTML);
}

function getLocalStorage() {
  const storedHistory = localStorage.getItem("storedHistory");
  const storedResult = localStorage.getItem("storedResult");
  const storedInput = localStorage.getItem("storedInput");

  if (storedResult !== null) {
    result.innerText = storedResult;
  } else {
    result.innerText = "";
  }

  if (storedInput !== null) {
    inputField.innerText = storedInput;
  } else {
    inputField.innerText = "";
  }

  if (storedHistory !== null) {
    historyList.innerHTML = storedHistory;
    addEventListenersToHistoryItems();
  }
  disableOperators();
}

/* Utan denna funkar inte capture-knapparna på historiken från local storage
pga eventListeners inte följer med */
function addEventListenersToHistoryItems() {
  const historyItems = document.querySelectorAll(".history-item");
  historyItems.forEach((item) => {
    const button = item.querySelector(".capture-button");
    const inputString = item.querySelector("code:first-of-type").innerText;
    const resultString = item.querySelector("code:last-of-type").innerText;
    button.addEventListener("click", () => {
      inputField.innerText = inputString;
      result.innerText = resultString;
      disableOperators();
    });
  });
}

export { initButtons, getLocalStorage };

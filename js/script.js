let round = 0; //contatore turno
let gameOver = false; // flag fine partita

const gameStatus = {
  x: new Array(),
  o: new Array(),
};
const winningState = [
  //righe
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  //colonne
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  //diagonali
  [2, 4, 6],
  [0, 4, 8],
];

const createGameField = (rows, type = 2) => {
  let grid = `<table> <tr>`;
  const squareTable = rows * rows;
  for (let i = 1; i <= squareTable; i++) {
    type === 2
      ? (grid += `<td id="${i}" onclick="addSign2Players(${i})"></td>`)
      : (grid += `<td id="${i}" onclick="addSignVersusComputer(${i})"></td>`);
    if (i % Math.sqrt(squareTable) == 0 && i != squareTable) {
      grid += `</tr><tr>`;
    } else if (i == squareTable) {
      grid += `</tr></table>`;
    }
  }
  grid += `</table>`;
  document.getElementById("game-field").innerHTML = grid;
};
const injectStatusMessage = (message) => {
  let targetNode = document.getElementById("statusList");
  let oldMessages = targetNode.innerHTML;
  // let data = Date.now();
  // let currentTime = `${data.getHours()} : ${data.getMinutes} : ${
  //   data.getSeconds
  // }`;
  targetNode.innerHTML = `${oldMessages} <li><i class="fas fa-robot"></i> > <span class="li-message">${message}</span></li>`;
};

createGameField(3, 1);

const addSign2Players = (id) => {
  round < 9 && !gameOver
    ? round % 2
      ? injectSign(id, "o")
        ? round++
        : forbiddenBlink(id)
      : injectSign(id, "x")
      ? round++
      : forbiddenBlink(id)
    : alert("Partita Terminata");
};

const addSignVersusComputer = (id) => {
  if (round < 9 && !gameOver) {
    if (!round + (1 % 2)) {
      if (injectSign(id, "x") && !gameOver) {
        round++;
        setTimeout(() => {
          computerPlayer();
          round++;
        }, 50);
      }
    }
  } else alert("Partita Terminata");
};

const injectSign = (id, symbol, clean = false) => {
  const currentSign = document.getElementById(id);
  if (currentSign.innerText && clean !== true) {
    return false;
  }
  // restituisco false solo se già presente
  else {
    currentSign.innerText = symbol;
    !clean && addSignOnArray(id, symbol);
    !clean && currentSign.classList.add(`called-${symbol}`);
    return true;
  }
};

const addSignOnArray = (id, symbol) => {
  gameStatus[symbol].push(id - 1);
  if (checkWin(symbol)) {
    gameOver = true;
  }
};

const checkWin = (symbol) => {
  for (let i = 0; i < winningState.length; i++) {
    let counter = 0;
    for (let j = 0; j < gameStatus[symbol].length; j++) {
      if (winningState[i].includes(gameStatus[symbol][j])) {
        counter++;
      }
      if (counter === 3) {
        highlightWin(winningState[i]);
        injectTextOverlay(`Ha vinto ${symbol.toUpperCase()}!`, 4000);

        injectStatusMessage(
          `<strong>Ha vinto ${symbol.toUpperCase()}!</strong>`
        );
        return true;
      }
      if (
        round === 8 &&
        j === gameStatus[symbol].length - 1 &&
        i === winningState.length - 1
      ) {
        injectStatusMessage("Pareggio");
        injectTextOverlay(`Pareggio :(`, 4000);
      }
    }
  }
};

const highlightWin = (winArray) => {
  for (let i = 1; i <= 9; i++) {
    document.getElementById(i).classList.remove("called-x");
    document.getElementById(i).classList.remove("called-o");
    if (!winArray.includes(i - 1)) {
      document.getElementById(i).classList.add("greyed-font");
    }
  }
  for (let i = 0; i < winArray.length; i++) {
    document.getElementById(winArray[i] + 1).classList.add("win");
  }
};

const forbiddenBlink = (id) => {
  let node = document.getElementById(id);
  node.classList.add("forbidden");
  setTimeout(() => {
    node.classList.remove("forbidden");
  }, 1000);
};

const resetGame = () => {
  round = 0;
  gameOver = false;
  gameStatus.x.length = 0;
  gameStatus.o.length = 0;
  //rimuovo X e 0 e highlights
  for (let i = 1; i < 10; i++) {
    injectSign(i, "", true);
    document.getElementById(i).classList.remove("win");
    document.getElementById(i).classList.remove("called-x");
    document.getElementById(i).classList.remove("called-o");
    document.getElementById(i).classList.remove("greyed-font");
  }
};

const twoPlayersGame = () => {
  injectStatusMessage("Modalità due giocatori!");
  createGameField(3, 2);
  resetGame();
};
const versusComputerGame = () => {
  injectStatusMessage("Modalità Contro il Computer");
  createGameField(3, 1);
  resetGame();
};

const freeBoxId = (symbol) => {
  const freeBoxes = [];
  for (let i = 1; i < 10; i++) {
    !document.getElementById(i).innerText ? freeBoxes.push(i) : null;
  }
  return freeBoxes;
};

const computerPlayer = () => {
  const freeBoxes = freeBoxId();
  let random = Math.floor(Math.random() * (freeBoxes.length - 1) + 1);
  injectSign(freeBoxes[random], "o");
};

const injectTextOverlay = (message, time = 4000) => {
  const text = document.getElementById("overlay-text");
  const overlay = document.getElementById("overlay-id");
  text.innerText = message;
  overlay.classList.remove("hide");
  setTimeout(() => {
    overlay.classList.add("hide");
  }, time);
};

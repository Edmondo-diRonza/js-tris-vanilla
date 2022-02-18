let round = 0; //contatore turno
let gameOver = false; // flag fine partita
let gameType = 1; //1 computer - 2 due giocatori

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
    type === 2 // tipo di partita col computer o con due giocatori
      ? (grid += `<td id="${i}" onclick="addSign2Players(${i})"></td>`)
      : (grid += `<td id="${i}" onclick="addSignVersusComputer(${i})"></td>`);
    if (i % rows === 0 && i != squareTable) {
      grid += `</tr><tr>`;
    } else if (i === squareTable) {
      grid += `</tr></table>`;
    }
  }
  // grid += `</table>`;
  document.getElementById("game-field").innerHTML = grid;
};
// Funzione per iniettare testo nella status bar
const injectStatusMessage = (message) => {
  let targetNode = document.getElementById("statusList");
  let oldMessages = targetNode.innerHTML;
  // let data = Date.now();
  // let currentTime = `${data.getHours()} : ${data.getMinutes} : ${
  //   data.getSeconds
  // }`;
  targetNode.innerHTML = `${oldMessages} <li><i class="fas fa-robot"></i> > <span class="li-message">${message}</span></li>`;
  return true;
};

createGameField(3, 1);

//funzione per aggiungere il simbolo X oppure O alternativamente fino al gameover
const addSign2Players = (idCella) => {
  round < 9 && !gameOver
    ? round % 2
      ? injectSign(idCella, "o")
        ? round++
        : forbiddenBlink(idCella)
      : injectSign(idCella, "x")
      ? round++
      : forbiddenBlink(idCella)
    : alert("Partita Terminata");
};

const addSignVersusComputer = (idCella) => {
  if (round < 9 && !gameOver) {
    if (!round + (1 % 2)) {
      if (injectSign(idCella, "x") && !gameOver) {
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
  if (!id) return false;
  const currentSign = document.getElementById(id);
  if (currentSign.innerText && clean !== true) {
    return false; // se la cella è impegnata ritorno false
  } else {
    currentSign.innerText = symbol;
    !clean && addSignOnArray(id, symbol); //se clean è true, sono in fase di reset della partita
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
  let max = 0;
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
  return false;
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
  }, 2000);
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
  gameType = 2;
  injectStatusMessage("Modalità due giocatori!");
  createGameField(3, 2);
  resetGame();
};
const versusComputerGame = () => {
  gameType = 1;
  injectStatusMessage("Modalità Contro il Computer");
  createGameField(3, 1);
  resetGame();
};
// funzione che restituisce l'array che sta per vincere
const aboutToWin = (symbol, count = 2) => {
  let aboutToWinArray = [];
  const otherPlayer = symbol === "x" ? "o" : "x";

  for (let i = 0; i < winningState.length; i++) {
    let counter = 0;
    for (let j = 0; j < gameStatus[symbol].length; j++) {
      if (winningState[i].includes(gameStatus[symbol][j])) {
        counter++;
      }
      if (counter === count) {
        let invalid = false;
        for (k = 0; k < winningState[i].length; k++) {
          let idToCheck = winningState[i][k];
          gameStatus[otherPlayer].includes(idToCheck) && (invalid = true); // se si verifica la prima parte assegna true ad invalid
        }
        !invalid && aboutToWinArray.push(winningState[i]); // se invalid diverso da true fa il push nell'array target
      }
    }
  }
  if (aboutToWinArray.length > 0) {
    return aboutToWinArray;
  } else {
    return false;
  }
};

// cerca caselle vuote
const freeBoxId = (symbol) => {
  const freeBoxes = [];
  for (let i = 1; i < 10; i++) {
    !document.getElementById(i).innerText && freeBoxes.push(i);
  }
  return freeBoxes;
};

const computerPlayer = () => {
  const freeBoxes = freeBoxId();
  let random = Math.floor(Math.random() * (freeBoxes.length - 1) + 1);
  //cerco di mettere la o al centro oppure casualmente
  if (round === 1) {
    injectSign(5, "o") ? null : injectSign(freeBoxes[random], "o");
  }

  if (round > 1) {
    if (!!aboutToWin("o", 2)) {
      // Prima controllo se ci sono possibilità di vincere ed eventualmente vinco!
      let target = aboutToWin("o", 2);
      console.log("Ho individuato una possibilità di vincità, hai perso! ");
      console.log(target);
      for (let i = 0; i < target.length; i++) {
        let idTarget = freeBoxFromArray(target[i]);
        if (injectSign(idTarget, "o")) i = target.length;
      }
    } else if (!!aboutToWin("x", 2)) {
      // altrimenti provo a difendersi controllando se ci sono posizioni vincenti per lo sfidante
      let target = aboutToWin("x", 2);
      console.log("Stai cercando di fregarmi? Provo a difendermi! ");
      if (target.length >= 2) {
        injectTextOverlay("Ottimo Trick!", 5000, false);
        injectStatusMessage(
          "Bella mossa, Amico! Non sbagliare proprio adesso!"
        );
      }
      for (let i = 0; i < target.length; i++) {
        let idTarget = freeBoxFromArray(target[i]);
        if (injectSign(idTarget, "o")) i = target.length;
      }
    } else {
      console.log(
        "Target consigliati ma non ancora implementati",
        aboutToWin("o", 1)
      );
      injectSign(freeBoxes[random], "o");
    }
  }
};

const freeBoxFromArray = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (!document.getElementById(array[i] + 1).innerText) {
      return array[i] + 1;
    }
  }
  return false;
};

const injectTextOverlay = (message, time = 4000, gameEnded = true) => {
  const text = document.getElementById("overlay-text");
  const overlay = document.getElementById("overlay-id");
  const playAgain = document.getElementById("play-again");
  text.innerText = message;
  overlay.classList.remove("hide");
  setTimeout(() => {
    overlay.classList.add("hide");
  }, time);
  gameEnded &&
    setTimeout(() => {
      playAgain.classList.remove("hide");
    }, time + 2500);
  gameEnded &&
    setTimeout(() => {
      playAgain.classList.add("hide");
    }, 20000);
};

const playAgain = () => {
  gameType === 1 ? versusComputerGame() : twoPlayersGame();
  document.getElementById("play-again").classList.add("hide");
};

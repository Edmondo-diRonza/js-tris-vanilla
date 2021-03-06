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

let winObj = {
  x: 0,
  o: 0,
  totalGames: 0,
};

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
  document.getElementById("game-field").innerHTML = grid;
  const animationArray = ["bounce-in-top", "slide-in-bck-center"];
  const randomAnimation = Math.floor(Math.random() * animationArray.length);
  document
    .querySelector("table")
    .classList.add(animationArray[randomAnimation]);
};
// Funzione per iniettare testo nella status bar
const injectStatusMessage = (message, color, noRobot = false) => {
  let styleColor = "";
  switch (color) {
    case "r":
      styleColor = "#ff5714";
      break;
    case "o":
      styleColor = "#feb000";
      break;
    case "x":
      styleColor = "#3399cc";
      break;
    case "b":
      styleColor = "blue";
      break;
    default:
      styleColor = `${color}`;
      break;
  }
  let targetNode = document.getElementById("statusList");
  let oldMessages = targetNode.innerHTML;
  noRobot
    ? (targetNode.innerHTML = `${oldMessages} <li><span class="li-message" style="color:${styleColor}">${message}</span></li>`)
    : (targetNode.innerHTML = `${oldMessages} <li><i class="fas fa-robot"></i> > <span class="li-message" style="color:${styleColor}">${message}</span></li>`);
  let targetBtn = document.getElementById("clean-button");
  if (targetNode.innerHTML.length > 474) {
    targetBtn.disabled = false;
    targetBtn.style.opacity = "1";
    targetBtn.style.cursor = "pointer"

  } else {
    targetBtn.disabled.disabled = true;
    targetBtn.style.opacity = ".3";
    targetBtn.style.cursor = "not-allowed"
  }

  targetNode.scrollIntoView({ behavior: "smooth", block: "end" });
  return true;
};
const clearStatusMessage = () => {
  let targetNode = document.getElementById("statusList");
  targetNode.innerHTML = "";
  basicHeader();
};
// simulo l'intestazione che aveva il C64 ;)
const basicHeader = () => {
  injectStatusMessage("**** COMMODORE 64", "", true);
  injectStatusMessage("BASIC V2 ****", "", true);
  injectStatusMessage("READY.", "b", true);
  injectStatusMessage("Modalit?? contro il Computer", "r");
  injectStatusMessage(`Partita n.${winObj.totalGames + 1}`);
};
createGameField(3, 1);
basicHeader();

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
        }, 200);
      } else {
        forbiddenBlink(idCella);
      }
    }
  } else alert("Partita Terminata");
};

//funzione che inietta un simbolo nell'id specificato, se risulta gi?? impegnato restituisce false
const injectSign = (id, symbol, clean = false) => {
  if (!id) return false;
  const currentSign = document.getElementById(id);
  if (currentSign.innerText && clean !== true) {
    return false; // se la cella ?? impegnata ritorno false
  } else {
    currentSign.innerText = symbol;
    !clean && addSignOnArray(id, symbol); //se clean ?? true, sono in fase di reset della partita
    !clean && currentSign.classList.add(`called-${symbol}`);
    !clean && currentSign.classList.add("cell-effects");
    return true;
  }
};

//funzione che memorizza nell'array lo stato della partita
const addSignOnArray = (id, symbol) => {
  gameStatus[symbol].push(id - 1);
  if (checkWin(symbol)) {
    gameOver = true;
  }
};

const injectScore = (symbol, score) => {
  let target = document.getElementById(`${symbol}-score`);
  target.innerText = score;
};
const resetScore = () => {
  winObj = {
    x: 0,
    o: 0,
    totalGames: 0,
  };
  injectScore("x", 0);
  injectScore("o", 0);
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
        winObj[symbol]++;
        winObj["totalGames"]++;
        injectScore(symbol, winObj[symbol]);
        injectStatusMessage(
          `Ha vinto ${symbol.toUpperCase()}!`,
          `${symbol === "x" ? "x" : "o"}`
        );
        injectStatusMessage(
          `*** <span style="color:#3399cc">X: ${winObj.x} </span> - <span style="color:#feb000">O: ${winObj.o} </span>***`,
          "",
          true
        );
        return true;
      }
      if (
        round === 8 &&
        j === gameStatus[symbol].length - 1 &&
        i === winningState.length - 1
      ) {
        injectStatusMessage("Pareggio", "b");
        injectTextOverlay(`Pareggio :(`, 0);
        winObj["totalGames"]++;
      }
    }
  }
  return false;
};

const highlightWin = (winArray) => {
  for (let i = 1; i <= 9; i++) {
    document.getElementById(i).classList.remove("called-x");
    document.getElementById(i).classList.remove("called-o");
    document.getElementById(i).classList.add("grid-blurring");
    if (!winArray.includes(i - 1)) {
      document.getElementById(i).classList.add("greyed-font");
    }
  }
  for (let i = 0; i < winArray.length; i++) {
    document.getElementById(winArray[i] + 1).classList.add("win");
    document.getElementById(winArray[i] + 1).classList.add("shake-lr");
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
    document.getElementById(i).classList.remove("grid-blurring");
    document.getElementById(i).classList.remove("shake-lr");
  }
  injectStatusMessage(`Partita n.${winObj.totalGames + 1}`);
};

const twoPlayersGame = () => {
  gameType === 1 && resetScore(); //se provengo da altra modalit?? di gioco, resetto il punteggio
  gameType = 2;
  injectStatusMessage("Modalit?? due giocatori!", "b");
  createGameField(3, 2);
  resetGame();
};
const versusComputerGame = () => {
  gameType === 2 && resetScore(); //se provengo da altra modalit?? di gioco, resetto il punteggio
  gameType = 1;
  injectStatusMessage("Modalit?? contro il Computer", "r");
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
      // Prima controllo se ci sono possibilit?? di vincere ed eventualmente vinco!
      let target = aboutToWin("o", 2);
      for (let i = 0; i < target.length; i++) {
        let idTarget = freeBoxFromArray(target[i]);
        if (injectSign(idTarget, "o")) {
          i = target.length;
        }
      }
    } else if (!!aboutToWin("x", 2)) {
      // altrimenti provo a difendersi controllando se ci sono posizioni vincenti per lo sfidante
      let target = aboutToWin("x", 2);
      if (target.length >= 2) {
        injectTextOverlay("Ottimo Trick!", 2000, false, true);
        injectStatusMessage(
          "Bella mossa, Amico! Non sbagliare proprio adesso!"
        );
      }
      for (let i = 0; i < target.length; i++) {
        let idTarget = freeBoxFromArray(target[i]);
        if (injectSign(idTarget, "o")) i = target.length;
      }
    } else if (!!aboutToWin("o", 1)) {
      // altrimenti controllo se ci sono celle favorevoli dove ottenere almeno due O in posizione vincente
      let target = aboutToWin("o", 1);
      let randomTarget = Math.floor(Math.random() * target.length); //scelgo casualmente una delle possibilit?? favorevoli proposte; qui ci sarebbe margine di miglioramento.
      injectSign(freeBoxFromArray(target[randomTarget]), "o");
    } else {
      //se non esistono celle favoreli, inietto la O in una posizione casuale
      injectSign(freeBoxes[random], "o");
    }
  }
};

const freeBoxFromArray = (array) => {
  let freeId = [];
  for (let i = 0; i < array.length; i++) {
    if (!document.getElementById(array[i] + 1).innerText) {
      freeId.push(array[i] + 1); // array delle celle libere
    }
  }
  if (freeId.length === 1) {
    // se ottengo solo una cella vuota restituisco quella
    return freeId[0];
  } else {
    // altrimenti ne restituisco una a caso
    // Math.floor(Math.random() * (max - min + 1) + min)
    let random = Math.floor(Math.random() * freeId.length);
    return freeId[random];
  }
};

const injectTextOverlay = (
  message,
  time = 4000,
  gameEnded = true,
  beatMode = false
) => {
  const text = document.getElementById("overlay-text");
  const overlay = document.getElementById("overlay-id");
  const playAgain = document.getElementById("play-again");
  text.innerText = message;
  let internalTime;
  time !== 0 ? (internalTime = time) : (internalTime = 4000);
  setTimeout(() => {
    overlay.classList.remove("hide");
  }, time / 2.8);

  beatMode &&
    setTimeout(() => {
      overlay.classList.add("beat");
    }, time / 2);

  setTimeout(() => {
    overlay.classList.add("hide");
  }, internalTime);

  beatMode &&
    setTimeout(() => {
      overlay.classList.remove("beat");
    }, internalTime);

  gameEnded &&
    setTimeout(() => {
      playAgain.classList.remove("hide");
      setTimeout(() => {
        playAgain.classList.add("hide");
      }, 15000);
    }, internalTime + 1000);
};

const playAgain = () => {
  gameType === 1 ? versusComputerGame() : twoPlayersGame();
  document.getElementById("play-again").classList.add("hide");
};

const handleMouseOver = () => {
  let targetNode = document.getElementById("my-name"); 
  injectStatusMessage("** Hi, my name is Edmondo! **", "b", true);
  injectStatusMessage(
    "Feel free to <br><a href='mailto:eddironz@gmail.com'>CONTACT ME</a>",
    "r",
    true
  );
};

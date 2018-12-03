const COLS = 7;
const ROWS = 6;
const SIZE = ROWS * COLS;
//Gamestate is held in these two global variables.
let boardState = [];
//By convention: empty == 0 yellow == 1, red == 2
let yellowsTurn = true;
let gameStopped = false;

document.addEventListener('DOMContentLoaded', function() {
  initializeGame(); //Sizes other than 6x7 not implemented
});

function initializeGame() {
  gameStopped = false;
  yellowsTurn = true;
  createGameBoard();
}

function createGameBoard() {
  let boardMain = document.getElementsByTagName('main')[0];
  for (let i = 0; i < SIZE + COLS; i++) {
    // create each element
    let boardTile = document.createElement('div');
    boardTile.className = 'tile';
    boardTile.id = i;

    let boardPortHole = document.createElement('div');
    boardPortHole.className = 'porthole';

    boardTile.appendChild(boardPortHole);
    boardMain.insertBefore(boardTile, boardMain.childNodes[0]);

    boardTile.addEventListener('mouseenter', mouseoverHandler);
    boardTile.addEventListener('mouseleave', mouseoutHandler);
    boardTile.addEventListener('click', tileClickHandler);
  }
  //make invisible row invisible
  for (let i = SIZE; i < SIZE + COLS; i++) {
    let boardTile = document.getElementById(i);
    boardTile.className = '';
  }
}

//click and mouse-over handlers
function mouseoverHandler() {
  let currentColumn = this.id % COLS;
  for (let i = currentColumn; i < SIZE; i += COLS) {
    document.getElementById(i).classList.add('hovered');
  }
  //set invisible row to correct tile
  yellowsTurn
    ? (document.getElementById(currentColumn + SIZE).firstChild.className =
        'yellow')
    : (document.getElementById(currentColumn + SIZE).firstChild.className =
        'red');
}
function mouseoutHandler() {
  let currentColumn = this.id % COLS;
  for (let i = currentColumn; i < SIZE; i += COLS) {
    document.getElementById(i).classList.remove('hovered');
  }
  document.getElementById(currentColumn + SIZE).firstChild.className = '';
}
function tileClickHandler() {
  let currentColumnNum = this.id % COLS;
  let currentColumnArr = [];
  for (let i = currentColumnNum; i < SIZE; i += COLS) {
    currentColumnArr.push(i);
  }
  yellowsTurn
    ? dropPiece('yellow', currentColumnArr)
    : dropPiece('red', currentColumnArr);

  nextTurn();
}

function dropPiece(piece, currentColumnArr) {
  for (let i = 0; i < ROWS; i++) {
    let j = currentColumnArr[i];
    if (!boardState[j]) {
      boardState[j] = piece;
      document.getElementById(j).firstChild.className = piece;
      if (i == ROWS - 1) {
        closeColumn(currentColumnArr);
      }
      checkTie();

      checkWinner(j);
      return j;
    }
  }
}

function nextTurn() {
  if (!gameStopped) {
    yellowsTurn = !yellowsTurn;
    let whoseTurn = document.getElementById('whose-turn');
    if (yellowsTurn) {
      whoseTurn.textContent = 'Yellow Goes';
      whoseTurn.className = 'yellow-goes';
    } else {
      whoseTurn.textContent = 'Red Goes';
      whoseTurn.className = 'red-goes';
    }
  }
}

function checkWinner(position) {
  let checkFor = yellowsTurn ? 'yellow' : 'red';
  checkHorizWinner(position);
  checkShortDiagWinner(position);
  checkLongDiagWinner(position);
  //diagonals are short or long depending on whether the interval
  //is 6, short, or 8, long.

  if (position >= COLS * 3) {
    checkVerticalWinner(position);
  }

  //helper function for each checking array
  function checkArrayForWinner(createdArray) {
    for (let i = 0; i < createdArray.length - 3; i++) {
      let checkString = '';
      for (let j = 0; j < 4; j++) {
        checkString += createdArray[j + i];
      }
      if (checkString == checkFor.repeat(4)) {
        declareWinner(checkFor);
      }
    } // for
  }
  //helper function for checking vertical and diagonals
  function checkUsingInterval(position, interval) {
    let testLine = [];
    let lineStart = position % interval;
    for (let i = lineStart; i < SIZE; i += interval) {
      testLine.push(boardState[i]);
      let wrapCheck = Math.floor((i + interval) / COLS) - Math.floor(i / COLS);

      checkArrayForWinner(testLine);

      if (wrapCheck !== 1) {
        return; //TEST THIS!!
      }
    }
  }

  function checkHorizWinner(position) {
    // populate an array for horiz from position
    let horizLine = [];
    let rowStart = position - (position % COLS);
    for (let i = rowStart; i < rowStart + COLS; i++) {
      horizLine.push(boardState[i]);
    }
    checkArrayForWinner(horizLine);
  }
  function checkVerticalWinner(position) {
    // populate an array for vert from position
    const interval = COLS;

    checkUsingInterval(position, interval);
    // console.log('checking vertical for', vertLine, checkFor);
  }
  function checkShortDiagWinner(position) {
    const interval = COLS - 1;

    checkUsingInterval(position, interval);
  }
  function checkLongDiagWinner(position) {
    const interval = COLS + 1;

    checkUsingInterval(position, interval);
  }
}
function declareWinner(winner) {
  let whoseTurn = document.getElementById('whose-turn');
  whoseTurn.textContent = winner.toUpperCase() + ' WINS!!';
  whoseTurn.className = winner + '-goes';
  closeBoard();
  gameStopped = true;
}

function checkTie() {
  let j = 0;
  for (let i = 0; i < SIZE; i++) {
    if (boardState[i]) {
      j++;
    }
  } //for
  if (j === 42) {
    declareTie();
  }
}
function declareTie() {
  closeBoard();
  alert('Tie! You both lose.');

  gameStopped = true;
}

function closeTile(position) {
  let tileToClose = document.getElementById(position);
  tileToClose.removeEventListener('mouseenter', mouseoverHandler);
  tileToClose.removeEventListener('mouseleave', mouseoutHandler);
  tileToClose.removeEventListener('click', tileClickHandler);
  tileToClose.classList.remove('hovered');
}
function closeColumn(currentColumnArr) {
  for (let i = 0; i < ROWS; i++) {
    let j = currentColumnArr[i];
    closeTile(j);
  }
}
function closeBoard() {
  for (let i = 0; i < SIZE; i++) {
    closeTile(i);
  }
}

//reset Button onclick handler
let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', function() {
  location.reload();
});

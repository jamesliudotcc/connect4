const COLS = 7;
const ROWS = 6;
const SIZE = ROWS * COLS;
//Gamestate is held in these two global variables.
let boardState = [];
//By convention: empty == 0 yellow == 1, red == 2
let yellowsTurn = true;

document.addEventListener('DOMContentLoaded', function() {
  initializeGame(ROWS, COLS); //Sizes other than 6x7 not implemented
  // create click handler for each tile
});

function initializeGame(rows, columns) {
  const ROWS = rows;
  const COLUMNS = columns;
  // for (let i = 0; i < ROWS * COLUMNS; i++) {
  //   boardState.push(0);
  // }
  createGameBoard(ROWS * COLUMNS);
}

function createGameBoard(boardSize) {
  let boardMain = document.getElementsByTagName('main')[0];
  for (let i = 0; i < boardSize; i++) {
    // create each element
    let boardTile = document.createElement('div');
    boardTile.className = 'tile';
    boardTile.id = i;

    let boardPortHole = document.createElement('div');
    boardPortHole.className = 'porthole';
    //use firstElementChild to access this from the tile.

    // append the elements onto the DOM
    boardTile.appendChild(boardPortHole);
    boardMain.insertBefore(boardTile, boardMain.childNodes[0]);

    // create hover handler for each tile, change the color of the column
    boardTile.addEventListener('mouseenter', mouseoverHandler);
    boardTile.addEventListener('mouseleave', mouseoutHandler);

    // create click handler for each tile
    boardTile.addEventListener('click', tileClickHandler);
  }
}
function mouseoverHandler() {
  let currentColumn = this.id % COLS;
  for (let i = currentColumn; i < SIZE; i += COLS) {
    document.getElementById(i).classList.add('hovered');
  }
}
function mouseoutHandler() {
  let currentColumn = this.id % COLS;
  for (let i = currentColumn; i < SIZE; i += COLS) {
    document.getElementById(i).classList.remove('hovered');
  }
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

  checkTie();
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
      checkWinner(j);
      return j;
    }
  }
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

function nextTurn() {
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
function checkWinner(position) {
  let checkFor = yellowsTurn ? 'yellow' : 'red';
  checkHorizWinner(position);
  if (position >= COLS * 3) {
    checkVerticalWinner(position);
    checkDiag1Winner(position);
    checkDiag2Winner(position);
  }
  function checkHorizWinner(position) {
    // populate an array for horiz from position
    let horizLine = [];
    let rowStart = position - (position % COLS);
    for (let i = rowStart; i < rowStart + COLS; i++) {
      horizLine.push(boardState[i]);
    }
    // loop through array to check if winner
    for (let i = 0; i < COLS - 3; i++) {
      let checkString = '';
      for (let j = 0; j < 4; j++) {
        checkString += horizLine[j + i];
      }
      if (checkString == checkFor.repeat(4)) {
        declareWinner(checkFor);
      }
    } // for
  }
  function checkVerticalWinner(position) {
    // populate an array for vert from position
    let vertLine = [];
    let colStart = position % COLS;
    console.log(position, colStart);
    for (let i = colStart; i < SIZE; i += COLS) {
      vertLine.push(boardState[i]);
    }
    //loop through array to check if winner
    for (let i = 0; i < ROWS - 3; i++) {
      let checkString = '';
      for (let j = 0; j < 4; j++) {
        checkString += vertLine[j + i];
      }
      if (checkString == checkFor.repeat(4)) {
        declareWinner(checkFor);
      }
    } // for
    console.log('checking vertical for', vertLine, checkFor);
  }
  function checkDiag1Winner(position) {
    console.log('checking diagonal1');
  }
  function checkDiag2Winner(position) {
    console.log('checking diagonal2');
  }
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
function declareWinner(winner) {
  alert(winner + ' wins!');
}

function declareTie() {
  document.getElementById('whose-turn').innerText =
    'Tie. Reload to play again.';
  document.getElementById('whose-turn').className = '';
  // document.body.addEventListener('click', function() {
  //   document.location.reload(false);
  // });
}

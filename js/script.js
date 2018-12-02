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
}
function dropPiece(piece, currentColumnArr) {
  for (let i = 0; i < ROWS; i++) {
    let j = currentColumnArr[i];
    if (!boardState[j]) {
      boardState[j] = piece;
      console.log(boardState);
      document.getElementById(j).firstChild.className = piece;
      return;
    }
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
function checkWinner() {}
function declareWinner(winner) {}

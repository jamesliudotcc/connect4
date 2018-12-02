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

//click and mouse-over handlers
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

// draw game as it is being played
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

//check for wins and ties, declare victory
function checkWinner(position) {
  let checkFor = yellowsTurn ? 'yellow' : 'red';
  checkHorizWinner(position);

  checkShortDiagWinner(position);
  checkLongDiagWinner(position);

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
    let vertLine = [];
    let colStart = position % COLS;
    for (let i = colStart; i < SIZE; i += COLS) {
      vertLine.push(boardState[i]);
    }
    checkArrayForWinner(vertLine);
    console.log('checking vertical for', vertLine, checkFor);
  }
  function checkShortDiagWinner(position) {
    console.log('checking diagonal1');
  }
  function checkLongDiagWinner(position) {
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
  closeBoard();
}

function declareTie() {
  closeBoard();
  alert('Tie! You both lose.');
  // document.body.addEventListener('click', function() {
  //   document.location.reload(false);
  // });
}

// closing tiles, columns, board
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
  document.getElementById('whose-turn').innerText = 'Reload to play again.';
  document.getElementById('whose-turn').className = ''; // why doe this only work
  //when there is a tie?
}

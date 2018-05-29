const Parallel = require('paralleljs');

function toggleBoard(rowIndex, colIndex) {
  this[rowIndex][colIndex] = + !this[rowIndex][colIndex];
}

function recurseQueen(board, boardSize, rowCount, colsUsed, majorDiagUsed, minorDiagUsed) {
    let solutions = 0;
    if (rowCount === boardSize) {
      let currentBoardArr = board;
      // do not count twice if queen was initially placed in middle column since it would be double counting that column
      // double the return values of all columns to the left of middle column (mirrored solutions)
      if (currentBoardArr[0][Math.floor(boardSize / 2)]) {
        return 1;
      } else {
        return 2;
      }
    }
    let colLimit = boardSize;
    for (let colIndex = 0; colIndex < colLimit; colIndex++) {
      if (colsUsed.hasOwnProperty(colIndex) || majorDiagUsed.hasOwnProperty(colIndex - rowCount) || minorDiagUsed.hasOwnProperty(colIndex + rowCount)) {
        continue;
      }
      // place the queen at that column index
      toggleBoard.call(board, rowCount, colIndex);
      // update used column and diagonals
      colsUsed[colIndex] = true;
      majorDiagUsed[colIndex - rowCount] = true;
      minorDiagUsed[colIndex + rowCount] = true;
      returnValue = recurseQueen(board, boardSize, rowCount + 1, colsUsed, majorDiagUsed, minorDiagUsed);
      if (returnValue) {
        solutions += returnValue;
      }
      toggleBoard.call(board, rowCount, colIndex);
      delete colsUsed[colIndex];
      delete majorDiagUsed[colIndex - rowCount];
      delete minorDiagUsed[colIndex + rowCount];
    }
    return solutions;
}

const generateNewBoard = (n) => {
  let board = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j  = 0; j < n; j++) {
      row.push(0);
    }
    board.push(row);
  }
  return board;
}

const nQueensWorker = (board, boardSize, rowCount, colsUsed, majorDiagUsed, minorDiagUsed) => {
  return new Promise((resolve, reject) => {
    new Parallel([board, boardSize, rowCount, colsUsed, majorDiagUsed, minorDiagUsed]).require(recurseQueen, toggleBoard).spawn(function (data) {
        return recurseQueen(data[0], data[1], data[2], data[3], data[4], data[5]);
      }, [board, boardSize, rowCount, colsUsed, majorDiagUsed, minorDiagUsed])
      .then(result => {
        resolve(result);
      })
  })
}

const countNQueensSolutions = (n) => {
  let board = generateNewBoard(n);
  let colsUsed = {};
  let majorDiagUsed = {};
  let minorDiagUsed = {};
  let rowCount = 0;
  // test wants value of 1 for n === 0
  if (n === 0) {
    return 1;
  } else if (n === 1) {
    return 1;
  }
  let promisesArray = [];
  for (let i = 0; i < Math.ceil(n / 2); i++) {
    toggleBoard.call(board, 0, i);
    colsUsed[i] = true;
    majorDiagUsed[i - rowCount] = true;
    minorDiagUsed[i + rowCount] = true;
    promisesArray.push(nQueensWorker(board, n, rowCount + 1, colsUsed, majorDiagUsed, minorDiagUsed));
    toggleBoard.call(board, 0, i);
    delete colsUsed[i];
    delete majorDiagUsed[i - rowCount];
    delete minorDiagUsed[i + rowCount];
  }
  return Promise.all(promisesArray);
};

// finishes in 38 seconds
countNQueensSolutions(15).then(result => console.log(result.reduce((acc, curr) => acc + curr, 0))) // should return 2,279,184

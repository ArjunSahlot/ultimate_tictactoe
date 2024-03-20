import { Board } from './board.js';

export class Grid {
  /**
   * 
   * @param {Board} board 
   */
  constructor(board, fromBoard = true) {
    this.grid = [];
    this.finishedGrids = board.finishedGrids;
    this.moves = board.moves;
    this.currGrid = board.currGrid;

    if (fromBoard) {
      this.fromBoard(board);
    } else {
      this.grid = board;
    }
  }

  fromBoard(board) {
    let grid = board.boardUI.getGrid();

    for (let mg = 0; mg < 9; mg++) {
      let miniGrid = [];

      // overlays
      if (!(grid[mg] instanceof Array)) {
        miniGrid.push(grid[mg]);
        continue;
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          miniGrid.push(grid[mg][i][j]);
        }
      }
      this.grid.push(miniGrid);
    }
  }

  legalMoves() {
    let moves = [];
    
    let miniGrid = this.grid[this.currGrid];
    for (let i = 0; i < 9; i++) {
      if (miniGrid[i] === null) {
        moves.push(i);
      }
    }

    return moves;
  }

  move(grid, cell) {
    let miniGrid = this.grid[grid];
    miniGrid[cell] = this.moves % 2 === 0;
    this.moves++;
    this.currGrid = cell;
  }

  equals(grid) {
    for (let i = 0; i < 9; i++) {
      let thisIncludes = this.finishedGrids.includes(i);
      let gridIncludes = grid.finishedGrids.includes(i);
      if (thisIncludes && gridIncludes) {
        continue;
      } else if (thisIncludes || gridIncludes) {
        return false;
      }

      for (let j = 0; j < 9; j++) {
        if (this.grid[i][j] !== grid.grid[i][j]) {
          return false;
        }
      }
    }

    return this.moves === grid.moves && this.currGrid === grid.currGrid;
  }

  clone() {
    return new Grid(this.grid, false);
  }

  toString() {
    // beautiful console.log
    // 0 - empty, 1 - X, 2 - O
    let grid = "";
    for (let i = 0; i < 9; i++) {
      if (i % 3 === 0) {
        grid += "\n";
      }
      for (let j = 0; j < 9; j++) {
        if (j % 3 === 0) {
          grid += " ";
        }
        if (this.grid[i][j] === null) {
          grid += "-";
        } else {
          grid += this.grid[i][j] ? "X" : "O";
        }
      }
      grid += "\n";
    }
    return grid;
  }
}

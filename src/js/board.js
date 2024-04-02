import { BoardUI } from "./boardui.js";

export class Board {
  constructor() {
    this.moves = 0;
    this.currGrid = -1; // -1 -> zoomed out
    this.finishedGrids = [];
    this.boardUI = new BoardUI();
  }

  get turn() {
    return (this.moves & 1) === 0;
  }

  updateTurn() {
    this.moves++;
    this.boardUI.updateCurrentPlayer(this.turn);
  }

  legalMove(cell) {
    if (typeof cell === "number") cell = this.boardUI.cells[cell];
    const gridIndex = this.boardUI.getRelativeIndex(cell.parentElement);
    return (
      this.boardUI.checkCell(cell) === 0 &&
      (this.currGrid === -1 || this.currGrid === gridIndex)
    );
  }

  checkWinner(miniGrid) {
    /**
            * takes in 3x3 grid

        returns:
            * 0 - TBD, not finished
            * 1 - X
            * 2 - O
            * 3 - draw
        */

    let filled = true; // check if fully filled
    for (let i = 0; i < 3; i++) {
      if (
        miniGrid[i][0] !== 0 &&
        miniGrid[i][0] !== 3 &&
        miniGrid[i][0] === miniGrid[i][1] &&
        miniGrid[i][1] === miniGrid[i][2]
      ) {
        return miniGrid[i][0];
      }

      if (
        miniGrid[0][i] !== 0 &&
        miniGrid[0][i] !== 3 &&
        miniGrid[0][i] === miniGrid[1][i] &&
        miniGrid[1][i] === miniGrid[2][i]
      ) {
        return miniGrid[0][i];
      }
      if (miniGrid[i].includes(0)) {
        filled = false;
      }
    }
    if (
      miniGrid[0][0] !== 0 &&
      miniGrid[0][0] !== 3 &&
      miniGrid[0][0] === miniGrid[1][1] &&
      miniGrid[1][1] === miniGrid[2][2]
    ) {
      return miniGrid[0][0];
    }
    if (
      miniGrid[0][2] !== 0 &&
      miniGrid[0][2] !== 3 &&
      miniGrid[0][2] === miniGrid[1][1] &&
      miniGrid[1][1] === miniGrid[2][0]
    ) {
      return miniGrid[0][2];
    }

    return filled ? 3 : 0;
  }

  updateGrid() {
    /**
      * checks if the grid has a new overlay/winner/etc.
      * returns: a grid number if a grid has won
      */

    const grid = this.boardUI.getGrid();
    for (let g = 0; g < 9; g++) {
      if (this.finishedGrids.includes(g)) continue;
      // 0 - not finished, 1 - X, 2 - O, 3 - draw
      const winner = this.checkWinner(grid[g]);
      if (winner !== 0) {
        this.finishedGrids.push(g);
        this.setOverlay(g, winner);
        break;
      }
    }

    if (this.finishedGrids.length >= 3) {
      const bigGrid = this.boardUI.getGrid(true);
      console.log(bigGrid);
      const winner = this.checkWinner(bigGrid);
      if (winner !== 0) {
        this.currGrid = -1;
        this.setOverlay(-1, winner);
      }
    }
  }

  setOverlay(grid, winner) {
    this.boardUI.setOverlay(grid, winner);
  }

  moveGrid() {
    if (this.finishedGrids.includes(this.currGrid) || this.currGrid === -1) {
      this.boardUI.highlightBig(this.turn);
      this.currGrid = -1;
    } else {
      this.boardUI.highlightSmall(this.currGrid, this.turn);
    }
  }

  reset() {
    this.boardUI.reset();
    this.currGrid = -1;
    this.moves = 0;
    this.boardUI.highlightBig(this.turn);
    this.finishedGrids = [];
  }

  move(cell) {
    if (cell === null) {
      // first message from sender which is going second is an empty move
      return;
    } else if (typeof cell === "number") {
      cell = this.boardUI.cells[cell];
    } else if (Array.isArray(cell)) {
      if (cell.length === 2) {
        cell = this.boardUI.cells[cell[0] * 9 + cell[1]];
      } else {
        return;
      }
    }

    const cellIndex = this.boardUI.getRelativeIndex(cell);

    this.currGrid = cellIndex;
    if (this.finishedGrids.includes(cellIndex)) {
      this.currGrid = -1;
    }

    this.boardUI.setCell(cell, this.turn ? 1 : 2);
    this.updateGrid();
    this.updateTurn();
    this.moveGrid();
  }

  lock() {
    this.boardUI.lock();
  }

  unlock() {
    this.boardUI.unlock();
  }
}

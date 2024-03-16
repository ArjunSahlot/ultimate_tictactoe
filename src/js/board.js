import { BoardUI } from "./boardui.js";

export class Board {
  constructor() {
    this.moves = 0;
    this.currGrid = -1; // -1 -> zoomed out
    this.finishedGrids = [];
    this.boardUI = new BoardUI();
  }

  turn() {
    return this.moves % 2 === 0;
  }

  updateTurn() {
    this.moves++;
    this.boardUI.updateCurrentPlayer(this.turn());
  }

  legalMove(cell) {
    if (typeof cell === "number") cell = this.boardUI.cells[cell];
    const gridIndex = this.boardUI.getRelativeIndex(cell.parentElement);
    return (
      this.boardUI.checkCell(cell) === null &&
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
        miniGrid[i][0] !== null &&
        miniGrid[i][0] === miniGrid[i][1] &&
        miniGrid[i][1] === miniGrid[i][2]
      ) {
        return miniGrid[i][0] ? 1 : 2;
      }

      if (
        miniGrid[0][i] !== null &&
        miniGrid[0][i] === miniGrid[1][i] &&
        miniGrid[1][i] === miniGrid[2][i]
      ) {
        return miniGrid[0][i] ? 1 : 2;
      }
      if (miniGrid[i].includes(null)) {
        filled = false;
      }
    }
    if (
      miniGrid[0][0] !== null &&
      miniGrid[0][0] === miniGrid[1][1] &&
      miniGrid[1][1] === miniGrid[2][2]
    ) {
      return miniGrid[0][0] ? 1 : 2;
    }
    if (
      miniGrid[0][2] !== null &&
      miniGrid[0][2] === miniGrid[1][1] &&
      miniGrid[1][1] === miniGrid[2][0]
    ) {
      return miniGrid[0][2] ? 1 : 2;
    }

    return filled ? 3 : 0;
  }

  updateGrid() {
    /**
            * checks if the grid has a new overlay/winner/etc.
            returns:
            * a grid number if a grid has won
        */

    const grid = this.boardUI.getGrid();
    for (let g = 0; g < 9; g++) {
      if (this.finishedGrids.includes(g)) continue;
      // 0 - not finished, 1 - X, 2 - O, 3 - draw
      const winner = this.checkWinner(grid[g]);
      if (winner === 3) {
        this.finishedGrids.push(g);

        this.setOverlay(g, null);
        break;
      } else if (winner !== 0) {
        this.finishedGrids.push(g);

        this.setOverlay(g, winner === 1);
        break;
      }
    }

    if (this.finishedGrids.length >= 3) {
      const bigGrid = this.boardUI.getGrid(true);
      const winner = this.checkWinner(bigGrid);
      if (winner !== 0) {
        this.currGrid = -1;
        // TODO: make this into a 'setWinner' function which will
        // change the info to the winner, overlay the winner character
        // across the entire board, and also set the right move count so
        // the highlighting matches the winner color
        if (winner === 3) {
          this.setOverlay(-1, null);
        } else {
          this.setOverlay(-1, winner === 1);
        }
      }
    }
  }

  setOverlay(grid, winner) {
    this.boardUI.setOverlay(grid, winner);
  }

  moveGrid() {
    if (this.finishedGrids.includes(this.currGrid) || this.currGrid === -1) {
      this.boardUI.highlightBig(this.turn());
    } else {
      this.boardUI.highlightSmall(this.currGrid, this.turn());
    }
  }

  reset() {
    this.boardUI.reset();
    this.currGrid = -1;
    this.moves = 0;
    this.boardUI.highlightBig(this.turn());
    this.finishedGrids = [];
  }

  move(cell) {
    if (cell === null) {
      // first message from sender which is going second is an empty move
      return;
    }

    const cellIndex = this.boardUI.getRelativeIndex(cell);

    this.currGrid = cellIndex;
    if (this.finishedGrids.includes(cellIndex)) {
      this.currGrid = -1;
    }

    this.boardUI.setCell(cell, this.turn());
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

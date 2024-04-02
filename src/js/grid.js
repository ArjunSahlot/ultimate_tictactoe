import { Board } from "./board.js";

export class Grid {
  /**
   *
   * @param {Board} board
   */
  constructor(board, fromBoard = true) {
    this.grid = [];
    this.winner = 0;

    if (fromBoard) {
      this.fromBoard(board);
      this.finishedGrids = board.finishedGrids;
      this.moves = board.moves;
      this.currGrid = board.currGrid;
    }
  }

  get turn() {
    return (this.moves & 1) === 0;
  }

  reset() {
    this.grid = [];
    for (let i = 0; i < 9; i++) {
      let miniGrid = [];
      for (let j = 0; j < 9; j++) {
        miniGrid.push(0);
      }
      this.grid.push(miniGrid);
    }
    this.finishedGrids = [];
    this.moves = 0;
    this.currGrid = -1;
    this.winner = 0;
  }

  getWinProbability(simulations) {
    if (simulations < 1) {
      return 0;
    }

    if (this.winner === 1) {
      return 1;
    } else if (this.winner === 2) {
      return 0;
    } else if (this.winner === 3) {
      return 0.5;
    }

    let wins = 0;
    for (let i = 0; i < simulations; i++) {
      let testGrid = this.clone();
      let moves = testGrid.legalMoves();
      while (moves.length !== 0) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        testGrid.move(move);
        moves = testGrid.legalMoves();
      }

      if (testGrid.winner === 1) {
        wins++;
      } else if (testGrid.winner === 3) {
        wins += 0.5;
      }
    }

    return wins / simulations;
  }

  getChildren() {
    let childs = [];

    for (let move of this.legalMoves()) {
      let child = this.clone();
      child.move(move);
      childs.push([move, child.serialize()]);
    }

    return childs;
  }

  serialize() {
    let string = "";

    for (let i = 0; i < 9; i++) {
      if (this.finishedGrids.includes(i)) {
        string += this.grid[i] + ",";
        continue;
      }
      string += this.grid[i].join("");
      if (i !== 8) {
        string += ",";
      }
    }

    string += "/";

    this.finishedGrids.sort();
    string += this.finishedGrids.join("") + ",";
    string += (this.turn ? "X" : "O") + ",";
    // string += this.moves + ",";
    string += this.currGrid;

    return string;
  }

  deserialize(string) {
    let [board, meta] = string.split("/");
    board = board.split(",");
    meta = meta.split(",");

    let grid = [];

    for (let i = 0; i < 9; i++) {
      let miniGrid = [];
      if (board[i].length === 1) {
        grid.push(parseInt(board[i]));
        continue;
      }
      for (let j = 0; j < 9; j++) {
        miniGrid.push(parseInt(board[i][j]));
      }
      grid.push(miniGrid);
    }

    this.grid = grid;
    this.finishedGrids = meta[0].split("").map((x) => parseInt(x));
    this.moves = meta[1] === "X" ? 0 : 1;
    // this.moves = parseInt(meta[1]);
    this.currGrid = parseInt(meta[2]);
  }

  fromBoard(board) {
    let grid = board.boardUI.getGrid();

    for (let mg = 0; mg < 9; mg++) {
      let miniGrid = [];

      // overlays
      if (!(grid[mg] instanceof Array)) {
        this.grid.push(grid[mg]);
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

    // grid is full
    if (this.finishedGrids.includes(this.currGrid)) {
      return moves;
    }

    // winner is decided
    if (this.winner !== 0) {
      return moves;
    }

    if (this.currGrid === -1) {
      for (let i = 0; i < 9; i++) {
        if (this.finishedGrids.includes(i)) continue;
        for (let j = 0; j < 9; j++) {
          if (this.grid[i][j] === 0) {
            moves.push([i, j]);
          }
        }
      }

      return moves;
    } else {
      let miniGrid = this.grid[this.currGrid];
      for (let i = 0; i < 9; i++) {
        if (miniGrid[i] === 0) {
          moves.push([this.currGrid, i]);
        }
      }

      return moves;
    }
  }

  move([grid, cell]) {
    this.grid[grid][cell] = this.turn ? 1 : 2;
    this.moves++;

    // if curr grid is full/finished, add it to finishedGrids
    let winner = this.gridWinner(this.grid[grid]);
    if (winner !== 0) {
      this.finishedGrids.push(grid);
      this.grid[grid] = winner;
    }

    if (this.finishedGrids.includes(cell)) {
      this.currGrid = -1;
    } else {
      this.currGrid = cell;
    }

    let bigWinner = this.checkWinner();
    if (bigWinner !== 0) {
      this.winner = bigWinner;
    }
  }

  checkWinner() {
    if (this.finishedGrids.length < 3) {
      return 0;
    }

    let bigGrid = [];

    for (let mg = 0; mg < 9; mg++) {
      if (this.finishedGrids.includes(mg)) {
        bigGrid.push(this.grid[mg]);
      } else {
        bigGrid.push(0);
      }
    }

    return this.gridWinner(bigGrid);
  }

  gridWinner(miniGrid) {
    for (let r = 0; r < 3; r++) {
      if (
        miniGrid[r * 3] !== 0 &&
        miniGrid[r * 3] === miniGrid[r * 3 + 1] &&
        miniGrid[r * 3 + 1] === miniGrid[r * 3 + 2]
      ) {
        return miniGrid[r * 3];
      }

      if (
        miniGrid[r] !== 0 &&
        miniGrid[r] === miniGrid[r + 3] &&
        miniGrid[r + 3] === miniGrid[r + 6]
      ) {
        return miniGrid[r];
      }
    }

    if (
      miniGrid[0] !== 0 &&
      miniGrid[0] === miniGrid[4] &&
      miniGrid[4] === miniGrid[8]
    ) {
      return miniGrid[0];
    }

    if (
      miniGrid[2] !== 0 &&
      miniGrid[2] === miniGrid[4] &&
      miniGrid[4] === miniGrid[6]
    ) {
      return miniGrid[2];
    }

    // draw / ongoing
    return miniGrid.includes(0) ? 0 : 3;
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
    let g = new Grid(0, false);
    g.grid = JSON.parse(JSON.stringify(this.grid));
    g.finishedGrids = JSON.parse(JSON.stringify(this.finishedGrids));
    g.moves = this.moves;
    g.currGrid = this.currGrid;
    return g;
  }

  toString(g = true, f = true, m = true, c = true, t = true, l = true) {
    let string = "";

    if (g) {
      for (let mgr = 0; mgr < 3; mgr++) {
        for (let r = 0; r < 3; r++) {
          for (let mg = mgr * 3; mg < 3 + mgr * 3; mg++) {
            if (mg % 3 !== 0) {
              string += "| ";
            }
            for (let c = 0; c < 3; c++) {
              let cell;
              if (this.finishedGrids.includes(mg)) {
                if (r === 1 && c === 1) {
                  cell = this.grid[mg];
                } else {
                  cell = 4;
                }
              } else {
                cell = this.grid[mg][r * 3 + c];
              }

              if (cell === 0) {
                string += "#";
              } else if (cell === 3) {
                string += "-";
              } else if (cell === 4) {
                // this is just used for printing
                string += " ";
              } else {
                string += cell === 1 ? "X" : "O";
              }

              string += " ";
            }
          }
          string += "\n";
        }
        string += "-".repeat(21) + "\n";
      }
    }

    if (f) string += "Finished Grids: " + this.finishedGrids + "\n";
    if (m) string += "Moves: " + this.moves + "\n";
    if (c) string += "Current Grid: " + this.currGrid + "\n";
    if (t) string += "Turn: " + (this.turn ? "X" : "O") + "\n";
    if (l) {
      string +=
      `Legal Moves (${this.legalMoves().length}): ` +
      "(" +
      this.legalMoves()
        .map((x) => x.join(","))
        .join("), (") +
      ")";
    }

    return string;
  }
}

import { Board } from "./board.js";
import { MCTS } from "./mcts.js";
import { Grid } from "./grid.js";

const board = new Board();
const grid = new Grid(board);
const bot = new MCTS(grid);

document.getElementById("start").addEventListener("click", () => {
  board.reset();
  grid.reset();
  bot.newPosition(grid);
});

for (const grid of board.boardUI.small) {
  grid.addEventListener("mouseover", () => {
    if (board.moves !== 0) return;
    board.boardUI.highlightSmall(grid, board.turn);
  });
}

for (const cell of board.boardUI.cells) {
  cell.addEventListener("mouseover", () => {
    board.boardUI.highlightCell(cell);
  });

  cell.addEventListener("mouseout", () => {
    board.boardUI.unhighlightCell(cell);
  });

  cell.addEventListener("click", () => {
    if (board.legalMove(cell)) {
      board.move(cell);

      let mg = board.boardUI.getRelativeIndex(cell.parentElement);
      let c = board.boardUI.getRelativeIndex(cell);
      grid.move([mg, c]);
      bot.newPosition(grid);

      let bestmove = bot.bestmove(1000);

      console.log(grid.toString());
      console.log(bestmove);

      if (bestmove[0]) {
        board.move(bestmove[0]);
        grid.move(bestmove[0]);
        bot.newPosition(grid);
      }
    } else {
      board.boardUI.shakeBorder();
    }
  });
}

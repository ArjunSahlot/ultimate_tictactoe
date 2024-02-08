import { Board } from "./board.js";

const board = new Board();

start.addEventListener("click", () => {
    board.reset();
});

for (const grid of board.boardUI.small) {
    grid.addEventListener("mouseover", () => {
        if (board.moves !== 0) return;
        board.boardUI.highlightSmall(grid, board.turn());
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
        } else {
            board.boardUI.shakeBorder();
        }
    });
}

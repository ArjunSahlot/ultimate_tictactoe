import { BoardUI } from '../js/boardui';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { assert } from 'console';

// read local.html file
const htmlContent = fs.readFileSync(path.resolve(__dirname, '../local.html'), 'utf-8');
const { window } = new JSDOM(htmlContent);
global.document = window.document;
global.window = window;

function checkDocument() {
    const big = document.querySelector('.big');
    const small = document.querySelector('.small');
    const cell = document.querySelector('.cell');
    const border = document.querySelector('.border');

    if (!(big && small && cell && border)) {
        throw new Error('Required classes or IDs are missing from the test HTML');
    }
}

describe('boardui Class', () => {
    beforeEach(() => {
        document.body.innerHTML = htmlContent;
        checkDocument();
    });

    test('should initialize correctly', () => {
        const boardui = new BoardUI();
        expect(boardui.big).toBeDefined();
        expect(boardui.small.length).toBeGreaterThan(0);
        expect(boardui.cells.length).toBeGreaterThan(0);
        expect(boardui.border).toBeDefined();
    });

    test('highlightSmall should be the correct color', () => {
        const boardui = new BoardUI();

        boardui.highlightSmall(0, true);
        let prevColor = boardui.border.style.borderColor;
        let prevShadow = boardui.border.style.boxShadow;
        let newColor = prevColor;
        let newShadow = prevShadow;
        let prevRand = true;

        for (let i = 1; i < 20; i++) {
            let rand = Math.random() > 0.5;
            boardui.highlightSmall(Math.floor(Math.random() * 9), rand);
            newColor = boardui.border.style.borderColor;
            newShadow = boardui.border.style.boxShadow;
            if (prevRand !== rand) {
                expect(prevColor).not.toBe(newColor);
                expect(prevShadow).not.toBe(newShadow);
            } else {
                expect(prevColor).toBe(newColor);
                expect(prevShadow).toBe(newShadow);
            }
            prevColor = newColor;
            prevShadow = newShadow;
            prevRand = rand;
        }
    });

    test('highlightBig should be the right color', () => {
        const boardui = new BoardUI();

        let prevColor = boardui.border.style.borderColor;
        let prevShadow = boardui.border.style.boxShadow;
        boardui.highlightBig(true);
        let newColor = boardui.border.style.borderColor;
        let newShadow = boardui.border.style.boxShadow;
        prevColor = newColor;
        prevShadow = newShadow;
        boardui.highlightBig(false);
        newColor = boardui.border.style.borderColor;
        newShadow = boardui.border.style.boxShadow;
        expect(prevColor).not.toBe(newColor);
        expect(prevShadow).not.toBe(newShadow);
        prevColor = newColor;
        prevShadow = newShadow;
        boardui.highlightBig(false);
        newColor = boardui.border.style.borderColor;
        newShadow = boardui.border.style.boxShadow;
        expect(prevColor).toBe(newColor);
        expect(prevShadow).toBe(newShadow);
        prevColor = newColor;
        prevShadow = newShadow;
        boardui.highlightBig(true);
        newColor = boardui.border.style.borderColor;
        newShadow = boardui.border.style.boxShadow;
        expect(prevColor).not.toBe(newColor);
        expect(prevShadow).not.toBe(newShadow);
    });

    test('getGrid should return the correct grid', () => {
        const boardui = new BoardUI();

        function applyTestGrid(bui, tgrid) {
            const cells = bui.cells;
            for (let i = 0; i < 9; i++) {
                if (typeof tgrid[i] === "string") {
                    const div = document.createElement("div");
                    div.classList.add("overlay");
                    const img = document.createElement("img");
                    img.src = `assets/${tgrid[i].toLowerCase()}.svg`;
                    div.appendChild(img);
                    bui.small[i].insertBefore(div, bui.small[i].children[0]);
                    continue;
                }
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 3; k++) {
                        if (tgrid[i][j][k] === "_") continue;
                        const img = document.createElement("img");
                        img.src = `assets/${tgrid[i][j][k].toLowerCase()}.svg`;
                        let cell = cells[i * 9 + j * 3 + k];
                        cell.insertBefore(img, cell.children[0]);
                    }
                }
            }
        }

        function verifyTestGrid(bui, tgrid) {
            const grid = bui.getGrid();
            for (let i = 0; i < 9; i++) {
                if (typeof tgrid[i] === "string") {
                    expect(grid[i]).toBe(tgrid[i] === "X");
                    continue;
                }
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 3; k++) {
                        if (tgrid[i][j][k] === "_") {
                            expect(grid[i][j][k]).toBe(null);
                            continue;
                        }
                        expect(grid[i][j][k]).toBe(tgrid[i][j][k] === "X");
                    }
                }
            }
        }

        const testGrid1 = [
            [["X", "_", "O"], ["O", "O", "X"], ["_", "X", "X"]],
            [["_", "O", "X"], ["_", "O", "X"], ["O", "_", "O"]],
            [["O", "X", "X"], ["X", "X", "O"], ["_", "_", "_"]],
            [["X", "O", "X"], ["O", "X", "O"], ["O", "O", "_"]],
            [["O", "X", "O"], ["X", "O", "X"], ["X", "X", "O"]],
            [["O", "_", "_"], ["_", "O", "_"], ["X", "O", "X"]],
            [["_", "_", "O"], ["X", "X", "O"], ["O", "X", "O"]],
            [["O", "X", "X"], ["O", "X", "O"], ["X", "O", "_"]],
            [["X", "O", "_"], ["X", "O", "X"], ["O", "_", "_"]]
        ]

        const testGrid2 = [
            [["X", "X", "X"], ["O", "O", "O"], ["X", "X", "X"]],
            [["O", "O", "O"], ["X", "X", "X"], ["O", "O", "O"]],
            [["X", "X", "X"], ["O", "O", "O"], ["X", "X", "X"]],
            [["O", "O", "O"], ["X", "X", "X"], ["O", "O", "O"]],
            [["X", "X", "X"], ["O", "O", "O"], ["X", "X", "X"]],
            [["O", "O", "O"], ["X", "X", "X"], ["O", "O", "O"]],
            [["X", "X", "X"], ["O", "O", "O"], ["X", "X", "X"]],
            [["O", "O", "O"], ["X", "X", "X"], ["O", "O", "O"]],
            [["X", "X", "X"], ["O", "O", "O"], ["X", "X", "X"]]
        ]

        const testGrid3 = [
            "X",
            [["O", "X", "O"], ["X", "O", "X"], ["O", "X", "O"]],
            "O",
            [["X", "O", "X"], ["O", "X", "O"], ["X", "O", "X"]],
            [["X", "O", "X"], ["O", "X", "O"], ["X", "O", "X"]],
            [["O", "X", "O"], ["X", "O", "X"], ["O", "X", "O"]],
            "O",
            "X",
            "O",
        ]

        applyTestGrid(boardui, testGrid1);
        verifyTestGrid(boardui, testGrid1);
        applyTestGrid(boardui, testGrid2);
        verifyTestGrid(boardui, testGrid2);
        applyTestGrid(boardui, testGrid3);
        verifyTestGrid(boardui, testGrid3);
    })

    test('setOverlay correctly modifies the HTML', () => {
        const boardui = new BoardUI();

        for (let i = 0; i < 9; i++) {
            let char = Math.random() > 0.5 ? "X" : "O";
            boardui.setOverlay(i, char === "X");
            let overlay = boardui.small[i].children[0];
            let img = overlay.children[0];
            expect(img.src).toContain(char.toLowerCase() + ".svg");
        }
    })

    test('reset properly resets the HTML', () => {
        let boardui = new BoardUI();

        for (let i = 0; i < 9; i++) {
            boardui.setOverlay(i, Math.random() > 0.5);
        }
        boardui.reset();
        for (let i = 0; i < 9; i++) {
            let overlay = boardui.small[i].children[0];
            expect(overlay.classList.contains("overlay")).toBeFalsy();
        }

        boardui = new BoardUI();
        for (let i = 0; i < 81; i++) {
            let char = Math.random() > 0.5 ? "X" : "O";
            boardui.setCell(boardui.cells[i], char);
        }
        boardui.reset();
        for (let i = 0; i < 81; i++) {
            let img = boardui.cells[i].children[0];
            expect(img).toBeUndefined();
        }
    })

    test('updateCurrentPlayer should update the HTML', () => {
        const boardui = new BoardUI();

        let info = document.getElementById("info");
        for (let i = 0; i < 20; i++) {
            let char = Math.random() > 0.5 ? "X" : "O";
            boardui.updateCurrentPlayer(char === "X");
            expect(info.querySelector("img").src.toLowerCase()).toContain(char.toLowerCase() + ".svg");
        }
    })
});


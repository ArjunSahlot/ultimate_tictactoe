import { BoardUI } from '../js/boardui';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

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

        let prevColor = boardui.border.style.borderColor;
        let prevShadow = boardui.border.style.boxShadow;
        boardui.highlightSmall(0, true);
        let newColor = boardui.border.style.borderColor;
        let newShadow = boardui.border.style.boxShadow;
        prevColor = newColor;
        prevShadow = newShadow;
        boardui.highlightSmall(3, false);
        newColor = boardui.border.style.borderColor;
        newShadow = boardui.border.style.boxShadow;
        expect(prevColor).not.toBe(newColor);
        expect(prevShadow).not.toBe(newShadow);
        prevColor = newColor;
        prevShadow = newShadow;
        boardui.highlightSmall(8, false);
        newColor = boardui.border.style.borderColor;
        newShadow = boardui.border.style.boxShadow;
        expect(prevColor).toBe(newColor);
        expect(prevShadow).toBe(newShadow);
        prevColor = newColor;
        prevShadow = newShadow;
        boardui.highlightSmall(8, true);
        newColor = boardui.border.style.borderColor;
        newShadow = boardui.border.style.boxShadow;
        expect(prevColor).not.toBe(newColor);
        expect(prevShadow).not.toBe(newShadow);
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
});


import { Board } from '../js/board';
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

describe('Board Class', () => {
    beforeEach(() => {
        document.body.innerHTML = htmlContent;
        checkDocument();
    });

    test('should initialize correctly', () => {
        const board = new Board();
        expect(board.moves).toBeDefined();
        expect(board.currGrid).toBeDefined();
        expect(board.finishedGrids).toBeDefined();
        expect(board.boardUI).toBeDefined();
    });

    test('moves increment properly', () => {
        const board = new Board();
        expect(board.moves).toBe(0);
        board.moves++;
        expect(board.turn()).toBeFalsy();
        board.moves++;
        expect(board.turn()).toBeTruthy();
    });

    test('legalMove returns a boolean', () => {
        const board = new Board();
        expect(board.legalMove(0)).toBeDefined();
        expect(board.legalMove(3)).toBeDefined();
        expect(board.legalMove(8)).toBeDefined();
        expect(board.legalMove(9)).toBeDefined();
        expect(board.legalMove(20)).toBeDefined();
        expect(board.legalMove(34)).toBeDefined();
        expect(board.legalMove(43)).toBeDefined();
        expect(board.legalMove(50)).toBeDefined();
        expect(board.legalMove(62)).toBeDefined();
        expect(board.legalMove(70)).toBeDefined();
        expect(board.legalMove(80)).toBeDefined();
    });

    test('checkWinner should correctly find winner', () => {
        const board = new Board();

        let testGrid = [
            [null, true, null],
            [null, true, null],
            [null, true, null]
        ];
        expect(board.checkWinner(testGrid)).toBe(1);
        testGrid = [
            [null, null, null],
            [true, true, true],
            [null, null, null]
        ];
        expect(board.checkWinner(testGrid)).toBe(1);
        testGrid = [
            [true, null, null],
            [true, null, null],
            [true, null, null]
        ];
        expect(board.checkWinner(testGrid)).toBe(1);
        testGrid = [
            [false, false, false],
            [null, null, null],
            [null, null, null]
        ];
        expect(board.checkWinner(testGrid)).toBe(2);
        testGrid = [
            [null, null, null],
            [null, null, null],
            [true, true, true]
        ];
        expect(board.checkWinner(testGrid)).toBe(1);
        testGrid = [
            [false, null, null],
            [false, null, null],
            [false, null, null]
        ];
        expect(board.checkWinner(testGrid)).toBe(2);
        testGrid = [
            [null, false, null],
            [true, null, false],
            [null, true, null]
        ];
        expect(board.checkWinner(testGrid)).toBe(0);
        testGrid = [
            [true, false, true],
            [false, true, false],
            [false, true, true]
        ];
        expect(board.checkWinner(testGrid)).toBe(1);
        testGrid = [
            [true, false, true],
            [false, true, false],
            [false, true, false]
        ];
        expect(board.checkWinner(testGrid)).toBe(3);
    })
    test('setOverlay correctly modifies the HTML', () => {
    })

    test('reset properly resets the HTML', () => {
    })

    test('updateCurrentPlayer should update the HTML', () => {
    })
});


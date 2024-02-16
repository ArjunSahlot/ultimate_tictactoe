export class BoardUI {
    constructor() {
        this.big = document.getElementsByClassName("big")[0];
        this.small = Array.from(document.getElementsByClassName("small"));
        this.cells = Array.from(document.querySelectorAll(".cell"));
        this.border = document.getElementsByClassName("border")[0];
    }

    highlightSmall(grid, turn) {
        let newGrid = null;
        if (typeof grid === "number") {
            newGrid = document.getElementsByClassName("small")[grid];
        } else {
            newGrid = grid;
        }
        this.highlightGrid(newGrid, turn);
    }

    highlightBig(turn) {
        let newGrid = document.getElementsByClassName("big")[0];
        this.highlightGrid(newGrid, turn);
    }

    highlightCell(cell) {
        cell.classList.add("cell-highlight");
    }

    unhighlightCell(cell) {
        cell.classList.remove("cell-highlight");
    }

    highlightGrid(grid, turn) {
        let rect = grid.getBoundingClientRect();
        this.border.style.display = "block";
        this.border.style.width = `${rect.width - 5}px`;
        this.border.style.height = `${rect.height - 5}px`;
        this.border.style.top = `${rect.top}px`;
        this.border.style.left = `${rect.left}px`;
        this.border.style.borderColor = turn ? "#da2940" : "#00aaff";
        this.border.style.boxShadow = turn
            ? "0 0 10px #da2940"
            : "0 0 10px #00aaff";
    }

    setOverlay(grid, winner) {
        const overlay = document.createElement("div");
        const small = this.small[grid];
        overlay.classList.add("overlay");

        for (const cell of small.children) {
            cell.classList.add("hidden");
        }

        this.setCell(overlay, winner);
        small.insertBefore(overlay, small.children[0]);
    }

    shakeBorder() {
        this.border.classList.add("shake");
        this.border.addEventListener(
            "animationend",
            () => {
                this.border.classList.remove("shake");
            },
            { once: true },
        );
    }

    getRelativeIndex(element) {
        const elements = Array.from(element.parentElement.children);
        let counter = 0;
        for (let i = 0; i < elements.length; i++) {
            if (element === elements[i]) {
                return counter;
            }

            if (element.tagName === elements[i].tagName && element.classList[0] == elements[i].classList[0]) {
                counter++;
            }
        }

        // never going to hit because element is always in elements
        return -1;
    }

    reset() {
        const grid = document.getElementsByClassName("big")[0];
        const cells = Array.from(document.getElementsByClassName("cell"));
        const miniGrids = Array.from(document.getElementsByClassName("small"));
        const overlays = Array.from(document.getElementsByClassName("overlay"));
        const info = document.getElementById("info");

        info.classList.remove("hidden");
        grid.classList.remove("hidden");

        for (const cell of cells) {
            this.removeCell(cell);
            cell.classList.remove("hidden");
        }

        for (const grid of miniGrids) {
            grid.classList.remove("hidden");
        }

        for (const overlay of overlays) {
            overlay.remove();
        }

        document.getElementById("start").innerHTML = "Reset Game";
    }

    updateCurrentPlayer(turn) {
        const info = document.getElementById("info");
        info.innerHTML = "Current player: ";
        this.setCell(info, turn, true);
    }

    setCell(cell, turn, inline = false) {
        const img = document.createElement("img");
        img.src = turn ? "assets/x.svg" : "assets/o.svg";
        if (inline) img.classList.add("inline");
        cell.insertBefore(img, cell.children[0]);

        img.classList.add("cell-animation");
        img.addEventListener(
            "animationend",
            () => {
                img.classList.remove("cell-animation");
            },
            { once: true },
        );
    }

    removeCell(cell) {
        const img = cell.querySelector("img");
        if (img) {
            cell.removeChild(img);
        }
    }

    checkCell(cell) {
        const img = cell.getElementsByTagName("img")[0];
        if (img) {
            return img.src.includes("x");
        }
        return null;
    }

    getGrid(big = false) {
        const grid = [];

        // if big: grid[row][col]
        if (big) {
            for (let i = 0; i < 3; i++) {
                grid.push([]);
                for (let j = 0; j < 3; j++) {
                    const cell =
                        document.getElementsByClassName("big")[0].children[i * 3 + j];
                    if (cell.classList.contains("overlay")) {
                        grid[i].push(this.checkCell(cell));
                    } else {
                        grid[i].push(null);
                    }
                }
            }
            return grid;
        }

        // grid[gridIndex][row][col]
        for (let i = 0; i < 9; i++) {
            if (this.small[i].children[0].classList.contains("overlay")) {
                grid.push(this.checkCell(this.small[i].children[0]));
                continue;
            }
            grid.push([]);
            grid[i].push([]);
            grid[i].push([]);
            grid[i].push([]);
            for (let j = 0; j < 9; j++) {
                const cell = this.small[i].children[j];
                grid[i][Math.floor(j / 3)].push(this.checkCell(cell));
            }
        }
        return grid;
    }
}

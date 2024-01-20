let moves = 0;
let currGrid = -1;
const finishedGrids = [];
const gameState = {};

const turn = () => {
	return moves % 2 === 0;
};

const moveGrid = (grid) => {
	let newGrid = 0;
	if (grid === -1) {
		newGrid = document.getElementsByClassName("big")[0];
	} else {
		newGrid = document.getElementsByClassName("small")[grid];
	}

	const rect = newGrid.getBoundingClientRect();
	const border = document.querySelector(".border");

	border.style.display = "block";
	border.style.width = `${rect.width - 5}px`;
	border.style.height = `${rect.height - 5}px`;
	border.style.top = `${rect.top}px`;
	border.style.left = `${rect.left}px`;
	border.style.borderColor = turn() ? "#da2940" : "#00aaff";
	border.style.boxShadow = turn() ? "0 0 10px #da2940" : "0 0 10px #00aaff";

	currGrid = grid;
};

const updateTurn = (flip = false) => {
	if (flip) {
		moves++;
	}
	const info = document.getElementById("info");
	info.innerHTML = "Current player: ";
	setCell(info);
};

const setCell = (cell, index = 0) => {
	const img = document.createElement("img");
	img.src = turn() ? "assets/x.svg" : "assets/o.svg";
	img.classList.add("inline");
	cell.insertBefore(img, cell.children[index]);

	img.classList.add("cell-animation");
	img.addEventListener(
		"animationend",
		() => {
			img.classList.remove("cell-animation");
		},
		{ once: true },
	);
};

const removeCell = (cell) => {
	const img = cell.querySelector("img");
	if (img) {
		cell.removeChild(img);
	}
};

const checkCell = (cell) => {
	// true if x, false if o, null if empty
	const img = cell.querySelector("img");
	if (img) {
		return img.src.includes("x");
	}
	return null;
};

const getGrid = () => {
	// grid[gridIndex][row][col]
	const grid = [];
	for (let i = 0; i < 9; i++) {
		grid.push([]);
		grid[i].push([]);
		grid[i].push([]);
		grid[i].push([]);
		for (let j = 0; j < 9; j++) {
			const cell = document.getElementsByClassName("small")[i].children[j];
			grid[i][Math.floor(j / 3)].push(checkCell(cell));
		}
	}
	return grid;
};

const checkGrid = (grid) => {
	// check minigrid for winner
	for (let i = 0; i < 3; i++) {
		if (
			grid[i][0] !== null &&
			grid[i][0] === grid[i][1] &&
			grid[i][1] === grid[i][2]
		) {
			return grid[i][0];
		}

		if (
			grid[0][i] !== null &&
			grid[0][i] === grid[1][i] &&
			grid[1][i] === grid[2][i]
		) {
			return grid[0][i];
		}
	}
	if (
		grid[0][0] !== null &&
		grid[0][0] === grid[1][1] &&
		grid[1][1] === grid[2][2]
	) {
		return grid[0][0];
	}
	if (
		grid[0][2] !== null &&
		grid[0][2] === grid[1][1] &&
		grid[1][1] === grid[2][0]
	) {
		return grid[0][2];
	}
	return null;
};

const updateGrid = (grid, cellIndex) => {
	if (finishedGrids.includes(cellIndex)) {
		moveGrid(-1);
	} else {
		moveGrid(cellIndex);
	}
	for (let i = 0; i < 9; i++) {
		if (finishedGrids.includes(i)) continue;
		const winner = checkGrid(grid[i]);
		if (winner !== null) {
			finishedGrids.push(i);
			const miniGrid = document.getElementsByClassName("small")[i];
			const overlay = document.createElement("div");
			overlay.classList.add("overlay");
			overlay.style.backgroundImage = `url(assets/${winner ? "x" : "o"}.svg)`;
			miniGrid.parentElement.insertBefore(overlay, miniGrid);
			miniGrid.classList.add("hidden");
			break;
		}
	}
};

const clearGrid = () => {
	const cells = document.querySelectorAll(".cell");

	for (const cell of cells) {
		removeCell(cell);
	}
};

const miniGrids = document.querySelectorAll(".small");
const cells = document.querySelectorAll(".cell");
const start = document.getElementById("start");
const info = document.getElementById("info");
const grid = document.getElementsByClassName("big")[0];

start.addEventListener("click", () => {
	clearGrid();
	moves = -1;
	updateTurn(true);
	info.classList.remove("hidden");
	grid.classList.remove("hidden");
	moveGrid(-1);
	for (const grid of miniGrids) {
		grid.classList.remove("hidden");
	}
	for (const overlay of document.querySelectorAll(".overlay")) {
		overlay.remove();
	}
	document.getElementById("start").innerHTML = "Reset Game";
});

for (const grid of miniGrids) {
	grid.addEventListener("mouseover", () => {
		if (moves !== 0) return;
		const allGrids = Array.from(document.querySelectorAll(".small"));
		const gridIndex = allGrids.indexOf(grid);
		moveGrid(gridIndex);
	});
}

for (const cell of cells) {
	cell.addEventListener("mouseover", () => {
		cell.classList.add("cell-highlight");
	});

	cell.addEventListener("mouseout", () => {
		cell.classList.remove("cell-highlight");
	});

	cell.addEventListener("click", () => {
		const parentGrid = cell.parentElement;
		const allGrids = Array.from(document.querySelectorAll(".small"));
		const allCellsInGrid = Array.from(parentGrid.children);

		const gridIndex = allGrids.indexOf(parentGrid);
		const cellIndex = allCellsInGrid.indexOf(cell);

		const border = document.querySelector(".border");

		if (
			checkCell(cell) === null &&
			(currGrid === -1 || gridIndex === currGrid)
		) {
			setCell(cell);
			updateTurn(true);
			updateGrid(getGrid(), cellIndex);
		} else {
			border.classList.add("shake");

			border.addEventListener(
				"animationend",
				() => {
					border.classList.remove("shake");
				},
				{ once: true },
			);
		}
	});
}

let moves = 0;
let currGrid = -1;

let turn = () => {
	return moves % 2 === 0;
};

let moveGrid = (grid) => {
	const big = document.getElementsByClassName("big")[0];
	if (currGrid === -1) {
		big.classList.remove("blue-highlight");
	} else {
		big.children[currGrid].classList.remove("orange-highlight");
	}
	if (grid === -1) {
		big.classList.add("blue-highlight");
	} else {
		big.children[grid].classList.add("orange-highlight");
	}
	currGrid = grid;
};

// TODO HIDE GAME BEFORE YOU START
let updateTurn = (flip = false) => {
	if (moves === 0) {
		document.getElementById("start").innerHTML = "Reset Game";
	}
	if (flip) {
		moves++;
	}
	const info = document.getElementById("info");
	info.innerHTML = "Current player: ";
	setCell(info);
};

let setCell = (cell) => {
	const img = document.createElement("img");
	img.src = turn() ? "assets/x.svg" : "assets/o.svg";
	img.classList.add("inline");
	cell.appendChild(img);
};

let removeCell = (cell) => {
	let img = cell.querySelector("img");
	if (img) {
		cell.removeChild(img);
	}
};

let checkCell = (cell) => {
	// true if x, false if o, null if empty
	let img = cell.querySelector("img");
	if (img) {
		return img.src.includes("x");
	}
	return null;
};

let clearGrid = () => {
	document.querySelectorAll(".cell").forEach((cell) => {
		removeCell(cell);
	});
};

document.addEventListener("DOMContentLoaded", function () {
	const miniGrids = document.querySelectorAll(".small");
	const cells = document.querySelectorAll(".cell");
	const start = document.getElementById("start");

	start.addEventListener("click", () => {
		clearGrid();
		moveGrid(-1);
		moves = -1;
		updateTurn(true);
	});

	miniGrids.forEach((grid) => {
		grid.addEventListener("mouseover", () => {
			if (moves === 0) grid.classList.add("orange-highlight");
		});

		grid.addEventListener("mouseout", () => {
			if (moves === 0) grid.classList.remove("orange-highlight");
		});
	});

	cells.forEach((cell) => {
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

			if (checkCell(cell) === null && (currGrid === -1 || gridIndex === currGrid)) {
				setCell(cell);
				cell.parentElement.classList.remove("orange-highlight");
				updateTurn(true);
				moveGrid(cellIndex);
			}
		});
	});
});

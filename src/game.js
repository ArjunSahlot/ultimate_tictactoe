let moves = 0;
let currGrid = -1;

let turn = () => {
	return moves % 2 === 0;
};

let moveGrid = (grid) => {
	let newGrid = 0;
	if (grid === -1) {
		newGrid = document.getElementsByClassName("big")[0];
	} else {
		newGrid = document.getElementsByClassName("small")[grid];
	}

	const rect = newGrid.getBoundingClientRect();
	const border = document.querySelector(".border");

	border.style.display = "block";
	border.style.width = `${rect.width - 6}px`;
	border.style.height = `${rect.height - 6}px`;
	border.style.top = `${rect.top}px`;
	border.style.left = `${rect.left}px`;
	border.style.borderColor = turn() ? "#da2940" : "#00aaff";
	border.style.boxShadow = turn() ? "0 0 10px #da2940" : "0 0 10px #00aaff";

	currGrid = grid;
};

let updateTurn = (flip = false) => {
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
	const info = document.getElementById("info");
	const grid = document.getElementsByClassName("big")[0];

	start.addEventListener("click", () => {
		clearGrid();
		moves = -1;
		updateTurn(true);
		info.classList.remove("hidden");
		grid.classList.remove("hidden");
		moveGrid(-1);
		document.getElementById("start").innerHTML = "Reset Game";
	});

	miniGrids.forEach((grid) => {
		grid.addEventListener("mouseover", () => {
			if (moves !== 0) return;
			const allGrids = Array.from(document.querySelectorAll(".small"));
			const gridIndex = allGrids.indexOf(grid);
			moveGrid(gridIndex);
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
			cell.querySelector("img").classList.add("cell-animation");

			setTimeout(() => {
				cell.querySelector("img").classList.remove("cell-animation");
			}, 500);
		});
	});
});

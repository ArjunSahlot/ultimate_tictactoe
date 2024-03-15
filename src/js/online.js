import { Board } from "./board.js";


let currentConnection = null;
let peer = null;
let state = {
  sender: null,
};

function initializePeer() {
  let connId = document.getElementById("conn-id");
  let removeSpinner = insertSpinner(connId);

  try {
    peer = new Peer();
  } catch (e) {
    alert(
      "Error initializing PeerJS, please try again by reloading this page: " +
        e,
    );
  }

  peer.on("open", (id) => {
    removeSpinner();
    document.getElementById("conn-id").innerHTML = id;
  });

  peer.on("connection", (connection) => {
    state.sender = false;
    setupConnectionHandler(connection, () => {});
  });
}

document.getElementById("join").addEventListener("click", () => {
  const otherid = document.getElementById("inp").value;
  if (!otherid) {
    alert("Please enter an ID to connect to");
    return;
  }

  let removeSpinner = insertSpinner(document.getElementById("join-load"));
  const connection = peer.connect(otherid);
  state.sender = true;

  setupConnectionHandler(connection, removeSpinner);
});

function setupConnectionHandler(conn, removeSpinner) {
  currentConnection = conn;

  conn.on("open", () => {
    removeSpinner();

    document.getElementsByClassName("connect-wrapper")[0].remove();

    const board = new Board();

    board.reset();

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
  });

  conn.on("data", (data) => {
    console.log("Received:", data);
    alert(data);
  });
}

function insertSpinner(targetElement) {
  if (!(targetElement instanceof Element)) {
    console.error("Invalid target element provided to insertSpinner.");
    return;
  }

  const svgNamespace = "http://www.w3.org/2000/svg";
  const spinner = document.createElementNS(svgNamespace, "svg");
  spinner.setAttribute("class", "loading");
  let size = getComputedStyle(document.documentElement).getPropertyValue(
    "--loading-size",
  );
  size = size.substring(0, size.length - 2);
  spinner.setAttribute("viewBox", "0 0 " + size + " " + size);

  const circle = document.createElementNS(svgNamespace, "circle");
  circle.setAttribute("cx", parseInt(size) / 2);
  circle.setAttribute("cy", parseInt(size) / 2);
  circle.setAttribute("r", parseInt(size) / 2 - 5);
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke-width", 5);
  spinner.appendChild(circle);

  targetElement.appendChild(spinner);

  return function removeSpinner() {
    spinner.remove();
  };
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  initializePeer();
  console.log("Peer initialized");

  const copyBtn = document.getElementById("copy-btn");
  const connId = document.getElementById("conn-id");
  copyBtn.addEventListener("click", function () {
    const range = document.createRange();

    range.selectNode(connId);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    copyBtn.classList.remove("fa-copy");
    copyBtn.classList.add("fa-check", "checkmark");

    setTimeout(function () {
      copyBtn.classList.remove("fa-check", "checkmark");
      copyBtn.classList.add("fa-copy");
    }, 2000);
  });
});

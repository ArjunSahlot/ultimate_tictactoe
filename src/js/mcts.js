import { Grid } from "./grid.js";

export class MCTS {
  /**
   * @param {Grid} grid
   */
  constructor(grid) {
    this.gGrid = grid;
    this.sGrid = grid.serialize();

    // exploration coefficient
    this.c = 1.414;

    // { sGrid: [[[move, sGrid], ...], [wins, games]] }
    this.gameTree = new Map();

    // [parent, move, sGrid, gGrid, trail, terminal, stats]
    this.selected = {};

    this.finishedSimulations = 0;
    this.finishedDepth = 0;
  }

  newPosition(grid) {
    this.gGrid = grid;
    this.sGrid = grid.serialize();
  }

  scoreNode(parentGames, wins, games) {
    // the algorithm for selecting the best node
    // Currently, UCBT is used
    if (games === 0) {
      return Infinity;
    } else {
      return (
        (wins / games) + 2 * Math.sqrt(Math.log(parentGames) / games)
      );
    }
  }

  select() {
    let gRoot = this.gGrid;
    let sRoot = this.sGrid;

    this.selected = {};
    let trail = [sRoot];

    let info = this.gameTree.get(sRoot);
    let children, stats;
    if (info) {
      children = info[0];
      stats = info[1];
    } else {
      children = false;
      stats = [0, 0];
    }

    while (children && children.length !== 0) {
      let currBest = [null, -Infinity];

      let parentGames = stats[1];

      for (let [move, position] of children) {
        let data = this.gameTree.get(position);
        let wins, games;
        if (data) {
          wins = data[1][0];
          games = data[1][1];
        } else {
          wins = 0;
          games = 0;
        }
        let score = this.scoreNode(parentGames, wins, games);

        if (score > currBest[1]) {
          currBest = [position, score];
        }
        if (games === 0) {
          // new node, let's select this
          let gGrid = new Grid(0, false);
          gGrid.deserialize(position);
          
          trail.push(position);

          this.selected = {
            parent: sRoot,
            move: move,
            sGrid: position,
            gGrid: gGrid,
            trail: trail,
            terminal: false,
            stats: [0, 0],
          }
          return;
        }
      }

      sRoot = currBest[0];
      gRoot = new Grid(0, false);
      gRoot.deserialize(sRoot);

      trail.push(sRoot);

      let info = this.gameTree.get(sRoot);
      if (info) {
        children = info[0];
        stats = info[1];
      } else {
        children = false;
        stats = [0, 0];
      }
    }

    // reached the end of the tree, or terminal node
    this.selected = {
      parent: sRoot,
      move: null,
      sGrid: sRoot,
      gGrid: gRoot,
      trail: trail,
      terminal: false,
      stats: [0, 0],
    }
  }

  expand() {
    if (!this.selected) {
      return;
    }

    if (this.gameTree.has(this.selected.sGrid)) {
      this.selected.terminal = true;
    } else {
      this.gameTree.set(this.selected.sGrid, [this.selected.gGrid.getChildren(), [0, 0]]);
    }
  }

  simulate(nGames = 1) {
    let xWins = nGames * this.selected.gGrid.getWinProbability(nGames);

    this.selected.stats = [nGames, xWins];

    this.finishedSimulations += nGames;
  }

  backpropagate() {
    if (!this.selected.trail || !this.selected.stats) return;

    let nGames = this.selected.stats[0];
    let xWins = this.selected.stats[1];
    let oWins = nGames - xWins;
    let turn = !this.selected.gGrid.turn;  // this is notted because turn is switched after move
    for (let i = this.selected.trail.length-1; i >= 0; i--) {
      let position = this.selected.trail[i];
      let [children, [wins, games]] = this.gameTree.get(position);

      wins += turn ? xWins : oWins;
      games += nGames;

      turn = !turn;

      this.gameTree.set(position, [children, [wins, games]]);

      // console.log(position);
      // let g = new Grid(0, false);
      // g.deserialize(position);
      // console.log(g.toString());
      // console.log(turn);
      // console.log(xWins, oWins);
      // console.log(wins, games);
    }
  }

  runIterations(stop) {
    while (!stop()) {
      this.select();
      this.expand();
      this.simulate();
      this.backpropagate();
      // document.getElementById("ai").innerHTML = "Query AI (" + this.finishedSimulations + ")";
    }
  }

  bestmove(time, depth, simulations) {
    let start = Date.now();
    let stop = () => {
      return (
        (time && Date.now() - start > time) ||
        (simulations && this.finishedSimulations > simulations) ||
        (depth && this.finishedDepth > depth)
      );
    };

    this.runIterations(stop);

    let possibleMoves = this.gameTree.get(this.sGrid)[0];
    let currBest = [null, -Infinity];
    let scores = [];
    for (let [move, position] of possibleMoves) {
      let data = this.gameTree.get(position);
      if (!data) {
        console.log("No data for position", position);
        continue;
      }
      let [_, [wins, games]] = this.gameTree.get(position);
      let score = wins / games;
      scores.push([move, score]);
      if (score > currBest[1]) {
        currBest = [move, score];
      }
    }

    console.log(scores);

    return currBest;
  }
}

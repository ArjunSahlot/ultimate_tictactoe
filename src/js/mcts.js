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

    // [parent, move, sGrid, gGrid, trail, sims]
    this.selected = {};
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
        wins / games + 2 * Math.sqrt(Math.log(parentGames) / games)
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
    }
  }

  expand() {
    if (!this.selected) {
      return;
    }

    this.gameTree.set(this.selected.sGrid, [this.selected.gGrid.getChildren(), [0, 0]]);
  }

  simulate(nGames = 1) {
    let nWins = nGames * this.selected.gGrid.getWinProbability(nGames);

    this.selected.stats = [nGames, nWins];
  }

  backpropagate() {
    if (!this.selected.trail || !this.selected.stats) return;

    let nGames = this.selected.stats[0];
    let nWins = this.selected.stats[1];
    let nLosses = nGames - nWins;
    let xBoard = this.selected.gGrid.turn;
    for (let i = this.selected.trail.length-1; i >= 0; i--) {
      // wins are counted if xBoard is true
      let position = this.selected.trail[i];
      let [children, stats] = this.gameTree.get(position);
      let [wins, games] = stats;

      wins += xBoard ? nWins : nLosses;
      games += nGames;

      this.gameTree.set(position, [children, [wins, games]]);
    }
  }

  runIterations(stop) {
    while (true) {
      this.select();
      this.expand();
      this.simulate();
      this.backpropagate();
      if (stop()) break;
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

    console.dir(this.gameTree, { depth: null });

    let possibleMoves = this.gameTree.get(this.sGrid)[0];
    let currBest = [null, -Infinity];
    for (let [move, position] of possibleMoves) {
      let data = this.gameTree.get(position);
      if (!data) {
        console.log("No data for position", position);
        continue;
      }
      let [_, [wins, games]] = this.gameTree.get(position);
      let score = wins / games;
      if (score > currBest[1]) {
        currBest = [move, score];
      }
    }

    return currBest;
  }
}

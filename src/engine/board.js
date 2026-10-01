import { parsePuzzle } from './parser.js';

export class Board {
  constructor(puzzleString, exit) {
    this.puzzleString = puzzleString;
    this.exit = exit;

    const { size, cars } = parsePuzzle(puzzleString);
    this.size = size;
    this.cars = cars;

    this.validate();
    this.render();
  }

  validate() {
    if (!this.cars.A) {
      throw new Error("Puzzle must contain a car labeled 'A'");
    }

    const A = this.cars.A;

    for (const [letter, car] of Object.entries(this.cars)) {
      if (car.length < 2) {
        throw new Error(`Car '${letter}' has length 1 (min 2)`);
      }
      if (!car.direction) {
        throw new Error(`Car '${letter}' has no direction`);
      }
    }

    if (this.exit.side === 'right' || this.exit.side === 'left') {
      if (A.direction !== 'H') {
        throw new Error(`Exit on '${this.exit.side}' requires car 'A' to be horizontal`);
      }
      if (A.row !== this.exit.position) {
        throw new Error(`Car 'A' must be in row ${this.exit.position}`);
      }
    } else {
      if (A.direction !== 'V') {
        throw new Error(`Exit on '${this.exit.side}' requires car 'A' to be vertical`);
      }
      if (A.col !== this.exit.position) {
        throw new Error(`Car 'A' must be in column ${this.exit.position}`);
      }
    }

    if (this.isWon()) {
      throw new Error('Puzzle is already solved (A is at the exit)');
    }
  }

  render() {
    const size = this.size;
    this.board = Array.from({ length: size }, () => Array(size).fill('.'));

    for (const [letter, car] of Object.entries(this.cars)) {
      for (let i = 0; i < car.length; i++) {
        const r = car.direction === 'H' ? car.row : car.row + i;
        const c = car.direction === 'H' ? car.col + i : car.col;
        this.board[r][c] = letter;
      }
    }
  }

  isWon() {
    if (!this.cars.A) return false;
    const A = this.cars.A;
    const last = this.size - 1;

    switch (this.exit.side) {
      case 'right':
        return A.row === this.exit.position && (A.col + A.length - 1) === last;
      case 'left':
        return A.row === this.exit.position && A.col === 0;
      case 'bottom':
        return A.col === this.exit.position && (A.row + A.length - 1) === last;
      case 'top':
        return A.col === this.exit.position && A.row === 0;
      default:
        return false;
    }
  }

  moveSingleStep(carId, step) {
    const car = this.cars[carId];
    const dir = car.direction;
    const last = this.size - 1;

    if (dir === 'H') {
      const newCol = car.col + step;
      if (newCol < 0 || newCol + car.length - 1 > last) return 'wall';
      const checkCol = step > 0 ? car.col + car.length : car.col - 1;
      if (this.board[car.row][checkCol] !== '.') return 'blocked';
      car.col = newCol;
      return 'ok';
    }

    if (dir === 'V') {
      const newRow = car.row + step;
      if (newRow < 0 || newRow + car.length - 1 > last) return 'wall';
      const checkRow = step > 0 ? car.row + car.length : car.row - 1;
      if (this.board[checkRow][car.col] !== '.') return 'blocked';
      car.row = newRow;
      return 'ok';
    }

    return 'invalid';
  }

  move(carId, steps) {
    if (!this.cars[carId]) {
      return { status: 'not_found', message: `Car '${carId}' does not exist!` };
    }

    const step = steps > 0 ? 1 : -1;
    let lastStatus = 'ok';

    for (let i = 0; i < Math.abs(steps); i++) {
      const status = this.moveSingleStep(carId, step);
      if (status !== 'ok') {
        lastStatus = status;
        break;
      }
      this.render();
    }
    this.render();

    const messages = {
      ok: 'OK',
      blocked: 'Blocked by another car!',
      wall: 'Wall hit!',
      invalid: 'Invalid direction',
      not_found: `Car '${carId}' does not exist!`,
    };

    return { status: lastStatus, message: messages[lastStatus] };
  }

  getState() {
    return {
      size: this.size,
      cars: JSON.parse(JSON.stringify(this.cars)),
      board: this.board.map((row) => [...row]),
      isWon: this.isWon(),
      exit: this.exit,
    };
  }

  reset() {
    const { cars } = parsePuzzle(this.puzzleString);
    this.cars = cars;
    this.render();
  }
}
export function getCarDragBounds(board, carId, cars, size) {
  const car = cars[carId];
  if (!car) return { min: 0, max: 0 };

  const isH = car.direction === 'H';
  const last = size - 1;
  let maxPos = 0;
  let maxNeg = 0;

  while (true) {
    const offset = maxPos + 1;
    const r = isH ? car.row : car.row + car.length - 1 + offset;
    const c = isH ? car.col + car.length - 1 + offset : car.col;
    if (r > last || c > last) break;
    if (board[r][c] !== '.') break;
    maxPos = offset;
  }

  while (true) {
    const offset = maxNeg - 1;
    const r = isH ? car.row : car.row + offset;
    const c = isH ? car.col + offset : car.col;
    if (r < 0 || c < 0) break;
    if (board[r][c] !== '.') break;
    maxNeg = offset;
  }

  return { min: maxNeg, max: maxPos };
}
export function detectSize(puzzleString) {
  const clean = puzzleString.replace(/\s/g, '');
  const total = clean.length;
  const size = Math.round(Math.sqrt(total));
  if (size * size !== total) {
    throw new Error(`Puzzle has ${total} cells, not a perfect square`);
  }
  return size;
}

export function parsePuzzle(puzzleString) {
  const size = detectSize(puzzleString);
  const clean = puzzleString.replace(/\s/g, '');
  const cars = {};

  for (let idx = 0; idx < clean.length; idx++) {
    const char = clean[idx];
    if (char === '.') continue;

    const row = Math.floor(idx / size);
    const col = idx % size;

    if (!cars[char]) {
      cars[char] = { row, col, length: 1, direction: null };
    } else {
      cars[char].length += 1;
      if (cars[char].direction === null) {
        cars[char].direction = cars[char].row === row ? 'H' : 'V';
      }
    }
  }

  return { size, cars };
}
const CORNER_CYCLE = ['tl', 'br', 'tr', 'bl'];

export function getCorner(letter) {
  const idx = (letter.charCodeAt(0) - 65) % 4;
  return CORNER_CYCLE[idx];
}

export function getCornerVars(letter) {
  const corner = getCorner(letter);
  switch (corner) {
    case 'tl': return { rx: '0%', ry: '0%' };
    case 'tr': return { rx: '100%', ry: '0%' };
    case 'br': return { rx: '100%', ry: '100%' };
    case 'bl': return { rx: '0%', ry: '100%' };
    default:   return { rx: '0%', ry: '0%' };
  }
}
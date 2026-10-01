export function getRotation(letter) {
  return (letter.charCodeAt(0) % 2 === 0) ? 90 : 270;
}
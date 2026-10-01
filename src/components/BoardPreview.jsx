import './BoardPreview.css';

export function BoardPreview({ board }) {
  const size = board.size;

  return (
    <div className="rhs-preview-frame">
      <div className="rhs-preview">
        {Object.entries(board.cars).map(([letter, car]) => {
          const isH = car.direction === 'H';
          const left = (car.col / size) * 100;
          const top = (car.row / size) * 100;
          const width = ((isH ? car.length : 1) / size) * 100;
          const height = ((isH ? 1 : car.length) / size) * 100;
          const isMain = letter === 'A';
          return (
            <div
              key={letter}
              className={`rhs-preview-piece ${
                isMain ? 'rhs-preview-main' : ''
              }`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
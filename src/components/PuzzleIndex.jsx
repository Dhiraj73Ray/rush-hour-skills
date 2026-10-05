


function pad2(n) {
  return String(n).padStart(2, '0');
}

export function PuzzleIndex({index, total, showIndex = true,}) {
    console.log(index, total)
    const indexStyle = {
      color: "#7f8ba5",
      fontWeight: 800,
      letterSpacing: "0.12em",
      fontVariantNumeric: "tabular-nums",
    };
    const hasIndex = showIndex && Number.isFinite(index) && Number.isFinite(total);

    return(
        <>
            {hasIndex && (
            <span style={indexStyle}>
              {pad2(index + 1)} / {pad2(total)}
            </span>
            )}
        </>
    )
}

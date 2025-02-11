export interface GridCell {
  x: number;
  y: number;
  answer: number;
}

export interface Game {
  grid: GridCell[][];
  rowNumbers: number[];
  colNumbers: number[];
}

function shuffleArray(array: number[]): number[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createGame(): Game {
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const rowNumbers = shuffleArray([...numbers]);
  const colNumbers = shuffleArray([...numbers]);

  const grid: GridCell[][] = rowNumbers.map((rowNum, i) =>
    colNumbers.map((colNum, j) => ({
      x: colNum,
      y: rowNum,
      answer: colNum * rowNum
    }))
  );

  return {
    grid,
    rowNumbers,
    colNumbers
  };
}

export function checkAnswer(cell: GridCell, answer: number): boolean {
  return cell.answer === answer;
}

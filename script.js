class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTopBox() {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1);
  }

  getRightBox() {
    if (this.x === 4) return null;
    return new Box(this.x + 1, this.y);
  }

  getBottomBox() {
    if (this.y === 4) return null;
    return new Box(this.x, this.y + 1);
  }

  getLeftBox() {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y);
  }

  getNextdoorBoxes() {
    return [
      this.getTopBox(),
      this.getRightBox(),
      this.getBottomBox(),
      this.getLeftBox()
    ].filter(box => box !== null);
  }
}

const getIndexFromBox = box => {
  return box.y * 5 + box.x;
};

const getBoxFromIndex = index => {
  return new Box(index % 5, Math.floor(index / 5));
};

const swapBoxes = (puzzleGrid, box1, box2) => {
  const piece1 = puzzleGrid.children[getIndexFromBox(box1)];
  const piece2 = puzzleGrid.children[getIndexFromBox(box2)];
  const emptyPiece = piece2.cloneNode();

  puzzleGrid.insertBefore(emptyPiece, piece1);
  puzzleGrid.insertBefore(piece1, piece2);
  puzzleGrid.removeChild(piece2);
};

const animateSwap = (piece1, box1, box2) => {
  const translateX = (box2.x - box1.x) * (piece1.offsetWidth + 2); // 2 is the total margin (1px on each side)
  const translateY = (box2.y - box1.y) * (piece1.offsetHeight + 2);

  // Add transition to the moving piece
  piece1.style.transform = `translate(${translateX}px, ${translateY}px)`;

  // Wait for the transition to complete before resetting the transform property
  setTimeout(() => {
    piece1.style.transform = ''; // Reset transform property
  }, 200); // 300ms matches the transition duration in the CSS file
};

const isAdjacent = (box1, box2) => {
  const xDiff = Math.abs(box1.x - box2.x);
  const yDiff = Math.abs(box1.y - box2.y);
  return (xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1);
};

const puzzleGrid = document.getElementById("puzzleGrid");

const shufflePuzzle = (puzzleGrid) => {
  const pieces = Array.from(puzzleGrid.children);
  const emptyPiece = document.getElementById("emptyPiece");
  
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (pieces[i] !== emptyPiece && pieces[j] !== emptyPiece) {
      const box1 = getBoxFromIndex(i);
      const box2 = getBoxFromIndex(j);
      swapBoxes(puzzleGrid, box1, box2);
    }
  }
};

puzzleGrid.addEventListener("click", e => {
  if (e.target.classList.contains("puzzle-piece")) {
    const clickedPieceIndex = Array.prototype.indexOf.call(puzzleGrid.children, e.target);
    const clickedBox = getBoxFromIndex(clickedPieceIndex);
    const emptyPieceIndex = Array.prototype.indexOf.call(puzzleGrid.children, document.getElementById("emptyPiece"));
    const emptyBox = getBoxFromIndex(emptyPieceIndex);

    if (isAdjacent(clickedBox, emptyBox)) {
      animateSwap(e.target, clickedBox, emptyBox);
      setTimeout(() => {
        swapBoxes(puzzleGrid, clickedBox, emptyBox);
      }, 200);
    }
  }
});

// Shuffle the puzzle when the page loads
shufflePuzzle(puzzleGrid);
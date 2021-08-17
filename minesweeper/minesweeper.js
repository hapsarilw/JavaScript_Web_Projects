// Logic

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

export function createBoard(boardSize, numberOfMines) {
  // 1 -> mine; 0 -> empty mine
  // board 2 x 2 = {[0,1],[0,0]}
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;
      const tile = {
        element,
        x,
        y,
        // Return boolean if return current position has mine / not
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  // Eligable status to be marked
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    // Status still same
    return;
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    tile.status = TILE_STATUSES.MARKED;
  }
}

export function revealTile(board, tile) {
  // If its mark & mark -> not reveal
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  /* Check if tile is mine */
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
  }
}

export function checkWin(board) {
  // check every single tile either number or hidden or marked with flag -> and make sure its a mine
  // every tile need this critea
  return board.every((row) => {
    return row.every((tile) => {
      return (
        // its been revealed
        tile.status === TILE_STATUSES.NUMBER ||
        // its mine
        (tile.mine && 
          // mine either hidden & marked
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
        )
    });
  });
}

export function checkLose(board) {
  // If single mine revealed, user LOSE -> reveal all mine
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

/* Get position of random mine based on numberOfMines inside of boardSize */
function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }
  return positions;
}

/* Give random number between 0 - boardSize, based on coordiate(a, b)*/
function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      // if it access in corner & out of tiles
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
}

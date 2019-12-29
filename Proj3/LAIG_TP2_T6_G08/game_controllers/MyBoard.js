class MyBoard extends CGFobject {
  constructor(scene, gameController) {
    super(scene);
    this.gameController = gameController;
    this.tiles = [];
    this.pieces = [];
    let uniqueID = 1;
    for (let x = 0; x < 6; x++) {
      for(let y = 0; y < 6; y++) {
        this.tiles.push(new MyTile(scene, uniqueID, this.gameController, x, y));
        uniqueID += 1;
      }
    }
    for (let i = 0; i < 6; i++) {
      this.pieces.push(new MyPiece(scene, uniqueID, this.gameController, this.tiles[i]));
      uniqueID += 1;
    }
    for (let i = 35; i > 29; i--) {
      this.pieces.push(new MyPiece(scene, uniqueID, this.gameController, this.tiles[i]));
      uniqueID += 1;
    }

  }
  display() {
    let colunm = 1;
    let row = 1;

    /*for (let tile of this.tiles) {
      tile.display();
    }*/
    for (let piece of this.pieces) {
      piece.display();
      break;
    }
  }
}

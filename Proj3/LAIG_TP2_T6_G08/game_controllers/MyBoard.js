class MyBoard extends CGFobject {
  constructor(scene, gameController) {
    super(scene);
    this.gameController = gameController;
    this.tiles = [];
    this.pieces = [];
    this.n_tiles = 36;
    this.n_pieces = 12;
    let uniqueID = 1;

    // 36 tiles
    for (let i = 0; i < this.n_tiles; i++) {
      this.tiles.push(new MyTile(scene, uniqueID, 10, 10, this.gameController));
      uniqueID += 1;
    }

    // 12 pieces
    for (let i = 0; i < this.n_pieces; i++) {
      this.pieces.push(new MyPiece(scene, uniqueID, this.gameController));
      uniqueID += 1;
    }
  }
  display() {
    let uniqueID = 1;

    for (let tile of this.tiles) {
      this.scene.registerForPick(uniqueID, this.gameController);
      tile.display();
      this.scene.clearPickRegistration();
      uniqueID += 1;
    }
    for (let piece of this.pieces) {
      this.scene.registerForPick(uniqueID, this.gameController);
      piece.display();
      this.scene.clearPickRegistration();
      uniqueID += 1;
    }
  }
}

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
    let colunm = 1;
    let row = 1;

    for (let tile of this.tiles) {
      this.scene.registerForPick(uniqueID, this.gameController);
      this.scene.pushMatrix();
      this.scene.rotate(Math.PI/4, 0, 1, 0);
      if((uniqueID-1) % 6 == 0){
        ++row;
        colunm = 1;
        row+=2; //AUX
      }
      this.scene.translate(/*AUX*/2*colunm, 1, row);
      tile.display();
      this.scene.popMatrix();
      this.scene.clearPickRegistration();
      uniqueID += 1;
      ++colunm;
    }
    for (let piece of this.pieces) {
      this.scene.registerForPick(uniqueID, this.gameController);
      piece.display();
      this.scene.clearPickRegistration();
      uniqueID += 1;
    }
  }
}

class MyBoard extends CGFobject {
  constructor(scene) {
    super(scene);
    this.tiles = [];
    this.pieces= [];
    this.n_tiles = 36;
    this.n_pieces= 12;
    this.uniqueID = 0;

    // 36 tiles
    for(let i = 0; i < this.n_tiles; i++){
      this.tiles.push(new MyTile(scene, this.uniqueID, 10, 10, this));
      this.uniqueID += 1;
    }

    // 12 pieces
    for(let i = 0; i < this.n_tiles; i++){
      this.tiles.push(new MyPiece(scene, this.uniqueID, this));
      this.uniqueID += 1;
    }
  }
}

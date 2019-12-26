class MyBoard extends CGFobject {
  constructor(scene) {
    super(scene);
    this.tiles = [];
    this.pieces= [];
    this.n_tiles = 36;
    this.n_pieces= 12;
    let uniqueID = 0;

    // 36 tiles
    for(let i = 0; i < this.n_tiles; i++){
      this.tiles.push(new MyTile(scene, uniqueID, 10, 10, this));
      uniqueID += 1;
    }

    // 12 pieces
    for(let i = 0; i < this.n_pieces; i++){
      this.pieces.push(new MyPiece(scene, uniqueID, this));
      uniqueID += 1;
    }
    console.log(this.tiles);
    console.log(this.pieces);
  }
  display(){
    for(let tile of this.tiles){
      tile.display();
    }
    for(let piece of this.pieces){
      piece.display();
    }
  }
}

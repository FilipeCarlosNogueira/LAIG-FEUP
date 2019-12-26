class MyBoard extends CGFobject {
  constructor(scene) {
    super(scene);
    this.tiles = [];
    this.pieces = [];
    this.n_tiles = 36;
    this.n_pieces = 12;
    let uniqueID = 1;

    // 36 tiles
    for (let i = 0; i < this.n_tiles; i++) {
      this.tiles.push(new MyTile(scene, uniqueID, 10, 10, this));
      uniqueID += 1;
    }

    // 12 pieces
    for (let i = 0; i < this.n_pieces; i++) {
      this.pieces.push(new MyPiece(scene, uniqueID, this));
      uniqueID += 1;
    }
  }
  display() {
    let uniqueID = 1;

    for (let tile of this.tiles) {
      this.scene.registerForPick(uniqueID, this);
      tile.display();
      this.scene.clearPickRegistration();
      uniqueID += 1;
    }
    for (let piece of this.pieces) {
      this.scene.registerForPick(uniqueID, this);
      piece.display();
      this.scene.clearPickRegistration();
      uniqueID += 1;
    }
  }
  managePick(mode, results) {
    if (mode == false) {
      if (results != null && results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          let obj = results[i][0];
          if (obj) {
            let uniqueId = results[i][1];
            this.OnObjectSelected(obj, uniqueId);
          }
        }
        results.splice(0, results.length);
      }
    }
  }
  OnObjectSelected(obj, id) {
    console.log('PICKING: ' + id);
    console.log(obj);
  }
}

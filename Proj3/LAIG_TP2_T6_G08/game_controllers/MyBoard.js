class MyBoard extends CGFobject {
  constructor(scene, gameController, boardState) {
    super(scene);
    this.gameController = gameController;
    this.tiles = [];
    this.pieces = [];

    this.init_materials();
    this.init_board(boardState);
  }
  init_materials(){    
    // TODO WIP make materials come from graph to allow different board for each theme

    this.selected_mat = new CGFappearance(this.scene);
    this.selected_mat.setAmbient(0.1745, 0.01175, 0.01175, 0.55);
    this.selected_mat.setDiffuse(0.61424, 0.04136, 0.04136, 0.55);
    this.selected_mat.setSpecular(0.727811, 0.626959, 0.626959, 0.55);
    this.selected_mat.setShininess(76.8);

    this.highlight_mat = new CGFappearance(this.scene);
    this.highlight_mat.setAmbient(0.1, 0.18725, 0.1745, 0.8);
    this.highlight_mat.setDiffuse(0.396, 0.74151, 0.69102, 0.8);
    this.highlight_mat.setSpecular(0.297254, 0.30829, 0.306678, 0.8);
    this.highlight_mat.setShininess(12.8);

    this.even_mat = new CGFappearance(this.scene);
    this.even_mat.setAmbient(0.19225, 0.19225, 0.19225, 1.0);
    this.even_mat.setDiffuse(0.50754, 0.50754, 0.50754, 1.0);
    this.even_mat.setSpecular(0.508273, 0.508273, 0.508273, 1.0);
    this.even_mat.setShininess(51.2);

    this.odd_mat = new CGFappearance(this.scene);
    this.odd_mat.setAmbient(0.23125, 0.23125, 0.23125, 1.0);
    this.odd_mat.setDiffuse(0.2775, 0.2775, 0.2775, 1.0);
    this.odd_mat.setSpecular(0.773911, 0.773911, 0.773911, 1.0);
    this.odd_mat.setShininess(89.6);

    this.playerB_mat = new CGFappearance(this.scene);
    this.playerB_mat.setAmbient(0.0215, 0.1745, 0.0215, 0.55);
    this.playerB_mat.setDiffuse(0.07568, 0.61424, 0.07568, 0.55);
    this.playerB_mat.setSpecular(0.633, 0.727811, 0.633, 0.55);
    this.playerB_mat.setShininess(76.8);

    this.playerA_mat = new CGFappearance(this.scene);
    this.playerA_mat.setAmbient(0.24725, 0.1995, 0.0745, 1.0);
    this.playerA_mat.setDiffuse(0.75164, 0.60648, 0.22648, 1.0);
    this.playerA_mat.setSpecular(0.628281, 0.555802, 0.366065, 1.0);
    this.playerA_mat.setShininess(51.2);
  }
  init_board(boardState){
    let uniqueID = 1;
    this.x_length = boardState.length - 2;
    this.y_length = boardState[0].length;
    let tile;
    for (let x = 0; x < this.x_length; x++) {
      for(let y = 0; y < this.y_length; y++) {
        tile = new MyTile(this.scene, uniqueID, this.gameController, x, y);
        this.tiles.push(tile);
        uniqueID += 1;
      }
    }
    let piece;
    for (let i = 0; i < this.y_length; i++) {
      piece = new MyPiece(this.scene, uniqueID, this.gameController, this.tiles[i], boardState[1][i], 1);
      this.pieces.push(piece);
      uniqueID += 1;
    }
    for (let i = 0; i < this.y_length; i++) {
      piece = new MyPiece(this.scene, uniqueID, this.gameController, this.tiles[this.tiles.length - i - 1], boardState[this.x_length][i], 2);
      this.pieces.push(piece);
      uniqueID += 1;
    }
  }
  getTile(x,y){
    return this.tiles[x + y * this.y_length];
  }
  update(t){
    for(let piece of this.pieces){
      for(let anim of piece.animations){
        anim.update(t);
      }
    }
  }
  /* Display all the tiles and pieces */
  display() {
    let colunm = 1;
    let row = 1;

    for (let tile of this.tiles) {
      if(tile.highlight) { this.highlight_mat.apply(); }
      else if((tile.x+tile.y)%2) { this.even_mat.apply(); }
      else { this.odd_mat.apply(); }
      tile.display();
    }
    for (let piece of this.pieces) {
      if(piece.selected) { this.selected_mat.apply(); }
      else if(piece.player == 2) { this.playerB_mat.apply(); }
      else if(piece.player == 1) { this.playerA_mat.apply(); }
      piece.display();
    }
  }
}

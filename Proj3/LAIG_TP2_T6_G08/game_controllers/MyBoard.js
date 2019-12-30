class MyBoard extends CGFobject {
  constructor(scene, gameController) {
    super(scene);
    this.gameController = gameController;
    this.tiles = [];
    this.pieces = [];

    this.init_materials();
    this.init_board();
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
      else if(piece.player == 0) { this.player0_mat.apply(); }
      else if(piece.player == 1) { this.player1_mat.apply(); }
      piece.display();
    }
  }
  init_materials(){    
    this.selected_mat = new CGFappearance(this.scene);
    this.selected_mat.setAmbient(0, 0, 0, 1);
    this.selected_mat.setDiffuse(1, 0.2, 0.2, 1);
    this.selected_mat.setSpecular(0, 0, 0, 0);
    this.selected_mat.setShininess(10.0);

    this.highlight_mat = new CGFappearance(this.scene);
    this.highlight_mat.setAmbient(0, 0, 0, 1);
    this.highlight_mat.setDiffuse(0, 1, 0.6, 1);
    this.highlight_mat.setSpecular(0, 0, 0, 0);
    this.highlight_mat.setShininess(10.0);

    this.even_mat = new CGFappearance(this.scene);
    this.even_mat.setAmbient(0, 0, 0, 1);
    this.even_mat.setDiffuse(0.2, 0.2, 0.2, 1);
    this.even_mat.setSpecular(0, 0, 0, 0);
    this.even_mat.setShininess(10.0);

    this.odd_mat = new CGFappearance(this.scene);
    this.odd_mat.setAmbient(0, 0, 0, 1);
    this.odd_mat.setDiffuse(0.8, 0.8, 0.8, 1);
    this.odd_mat.setSpecular(0, 0, 0, 0);
    this.odd_mat.setShininess(10.0);

    this.player0_mat = new CGFappearance(this.scene);
    this.player0_mat.setAmbient(0, 0, 0, 1);
    this.player0_mat.setDiffuse(0.2, 1, 0.2, 1);
    this.player0_mat.setSpecular(0, 0, 0, 0);
    this.player0_mat.setShininess(10.0);

    this.player1_mat = new CGFappearance(this.scene);
    this.player1_mat.setAmbient(0, 0, 0, 1);
    this.player1_mat.setDiffuse(0.2, 0.2, 1, 1);
    this.player1_mat.setSpecular(0, 0, 0, 0);
    this.player1_mat.setShininess(10.0);
  }
  init_board(){
    let uniqueID = 1;
    /* In the future board size and types of pieces will be given by prolog server */
    for (let x = 0; x < 6; x++) {
      for(let y = 0; y < 6; y++) {
        this.tiles.push(new MyTile(this.scene, uniqueID, this.gameController, x, y));
        uniqueID += 1;
      }
    }
    /* WIP Apply material for player A */
    for (let i = 0; i < 6; i++) {
      this.pieces.push(new MyPiece(this.scene, uniqueID, this.gameController, this.tiles[i], 2, 0));
      uniqueID += 1;
    }
    /* WIP Apply material for player B  */
    for (let i = 35; i > 29; i--) {
      this.pieces.push(new MyPiece(this.scene, uniqueID, this.gameController, this.tiles[i], 3, 1));
      uniqueID += 1;
    }
  }
  update(t){

  }
}

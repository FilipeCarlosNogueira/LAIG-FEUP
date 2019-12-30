class MyGameController {
  constructor(scene) {
    this.scene = scene;
    // the board
    this.board = new MyBoard(scene, this);
    // list of themes
    this.themes = {
                    'normal':   'normal.xml',
                    'normal1':  'normal1.xml',
                  };
    // theme selected
    this.currentTheme = new MySceneGraph(this.themes['normal'], this.scene);
    // 0 for player A, 1 for player B
    this.player_turn = 1;
    this.selected_piece = null;
    this.highlighted = [];
  }
  /* Select different theme */
  changeTheme(id){
    this.currentTheme = new MySceneGraph(this.themes[id], this.scene);
  }
  /* Display the scene on the screen */
  display() {
    this.scene.clearPickRegistration();
    this.board.display();
  }
  /* Get results of picking and use them */
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
  /* When object is selected check if it is a piece or a tile */
  OnObjectSelected(obj, id) {
    if(obj instanceof MyPiece){
      this.SelectPiece(obj);
    } else if(obj instanceof MyTile){
      if(obj.piece) { // if tile has a piece select it
        this.SelectPiece(obj.piece);
      } else if(this.selected_piece) {  // if tile does not have a piece than move selected piece
        this.MovePiece(obj);
      }
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
  /* When piece is selected */
  SelectPiece(piece){
    if(piece == this.selected_piece) {  // deselect piece if double-click
      piece.selected = false;
      piece.animations = [];
      this.selected_piece = null;
      this.UnhightlightTiles();
    } else if(piece.player == this.player_turn){  // select piece if it is player turn
      piece.selected = true;
      if(this.selected_piece) {
        this.selected_piece.selected = false;
        this.selected_piece.animations = [];
      }
      this.selected_piece = piece;
      piece.animations.push(new MyPieceAnimation(this.scene, 3, 0, 1, 0));
      this.UnhightlightTiles();
      this.HightlightTiles(piece.tile.x, piece.tile.y);
    }
  }
  /* Move selected piece */
  MovePiece(tile){
    let x = tile.x, y= tile.y;
    // WIP ask prolog server if valid move
    // assyncronous request, at the end should animate piece towards cell
    // since movements are up, down, left, right its is simple changing the x and z accordingly
    // this.selected_piece.animations.push(new MyPieceAnimation(this.scene, 3, 0, 0, 0));
  }
  HightlightTiles(x, y){
    // WIP ask prolog server possible moves
    // for now all adjacent are possible
    for(let tile of this.board.tiles){
      if(tile.x == x && tile.y == (y - 1)) { tile.highlight = true; this.highlighted.push(tile); }
      else if(tile.x == x && tile.y == (y + 1)) { tile.highlight = true; this.highlighted.push(tile); }
      else if(tile.y == y && tile.x == (x - 1)) { tile.highlight = true; this.highlighted.push(tile); }
      else if(tile.y == y && tile.x == (x + 1)) { tile.highlight = true; this.highlighted.push(tile); }
    }
  }
  UnhightlightTiles(){
    for(let tile of this.highlighted){
      tile.highlight = false;
    }
    this.highlighted = [];
  }
  update(t){
    this.board.update(t);
    if(this.selected_piece)
      for(let anim of this.selected_piece.animations)
        anim.update(t);
  }
}

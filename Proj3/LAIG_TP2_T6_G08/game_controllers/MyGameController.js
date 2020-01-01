class MyGameController {
  constructor(scene) {
    this.scene = scene;
    this.initBoard();
    this.initThemes();
  }
  /* Initialize variables used for game logic */
  initBoard(){
    // the board
    this.board = new MyBoard(this.scene, this);
    // 0 for player B, 1 for player A
    this.player_turn = 1;
    this.selected_piece = null;
    // array of highlighted tiles
    this.highlighted = [];
    // array of game moves
    this.moves = [];
  }
  /* Initialize all themes to be used */
  initThemes(){
    // list of themes
    this.themes = [];
    this.themes.push('basic.xml');
    this.themes.push('stadium.xml');
    this.themes.push('hp_chess.xml');
    // theme selected
    this.currentTheme = new MySceneGraph(this.themes[1], this.scene);
  }
  /* Display the scene on the screen */
  display() {
    this.scene.clearPickRegistration();
    this.currentTheme.displayScene();
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
      this.selectPiece(obj);
    } else if(obj instanceof MyTile){
      if(obj.piece) { // if tile has a piece select it
        this.selectPiece(obj.piece);
      } else if(this.selected_piece) {  // if tile does not have a piece than move selected piece
        this.movePiece(this.selected_piece, obj);
      }
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
  /* When piece is selected */
  selectPiece(piece){
    if(piece == this.selected_piece) {  // deselect piece if double-click
      piece.selected = false;
      piece.animations[0].reverse(piece.clearAnimations);
      this.selected_piece = null;
      this.unhighlightTiles();
    } else 
    if(piece.player == this.player_turn) {  // select piece if it is player turn
      if(this.selected_piece) { this.selected_piece.selected = false; this.selected_piece.animations[0].reverse(piece.clearAnimations); }
      console.log(this.moves);
      this.undoMove();
      console.log(this.moves);
      piece.selected = true;
      this.selected_piece = piece;
      piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0);
      this.unhighlightTiles();
      this.highlightTiles(piece.tile.x, piece.tile.y);
    }
  }
  /* Move selected piece */
  movePiece(piece, tile){
    if(piece.isMoving()) return;
    let x = tile.x, y = tile.y;
    let px = piece.tile.x, py = piece.tile.y;
    // WIP ask prolog server if valid move
    // assyncronous request, at the end should animate piece towards cell
    // since movements are up, down, left, right its is simple changing the x and z accordingly
    let highlight = this.highlightTiles.bind(this);
    let unhighlight = this.unhighlightTiles.bind(this);
    let gameMove = this.moves.push.bind(this);
    let chain = function(){
      piece.move(tile);
      unhighlight();
      highlight(x,y);
      gameMove(new MyGameMove(this.scene, this, piece.tile, tile, piece));
    };

    if(px == x && py == (y - 1))      { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  1, 0,  0, chain); }
    else if(px == x && py == (y + 1)) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5, -1, 0,  0, chain); }
    else if(py == y && px == (x - 1)) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  0, 0,  1, chain); }
    else if(py == y && px == (x + 1)) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  0, 0, -1, chain); }
  }
  /* Undo previous move */
  undoMove(){
    // get move from array
    let prev_move = this.moves.pop(); if(!prev_move) return;
    let chain = function(){
      let x = prev_move.dest.x - prev_move.orig.x;
      let z = prev_move.dest.z - prev_move.orig.z;
      // move to tile -> down
      if(x == -1)      { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  0, 0,  1, piece.animations[0].reverse, false); }
      else if(x ==  1) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  0, 0, -1, piece.animations[0].reverse, false); }
      else if(y == -1) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  1, 0,  0, piece.animations[0].reverse, false); }
      else if(y ==  1) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5, -1, 0,  0, piece.animations[0].reverse, false); }
    };
    // up -> move to tile -> down
    piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0, chain);
  }
  /* Highlight adjacent tiles to (x,y) */
  highlightTiles(x, y){
    // WIP ask prolog server possible moves
    // for now all adjacent are possible
    for(let tile of this.board.tiles){
      if(tile.x == x && tile.y == (y - 1)) { tile.highlight = true; this.highlighted.push(tile); }
      else if(tile.x == x && tile.y == (y + 1)) { tile.highlight = true; this.highlighted.push(tile); }
      else if(tile.y == y && tile.x == (x - 1)) { tile.highlight = true; this.highlighted.push(tile); }
      else if(tile.y == y && tile.x == (x + 1)) { tile.highlight = true; this.highlighted.push(tile); }
    }
  }
  /* Remove all highlighted tiles */
  unhighlightTiles(){
    for(let tile of this.highlighted){
      tile.highlight = false;
    }
    this.highlighted = [];
  }
  /* Update game every few ms */
  update(t){
    this.board.update(t);
    /*
      TODO WIP
      If bot playing, do move
      interface will have dropdown
    */
  }
}

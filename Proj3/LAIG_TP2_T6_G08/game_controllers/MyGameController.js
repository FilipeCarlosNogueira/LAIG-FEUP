class MyGameController {
  constructor(scene) {
    this.scene = scene;
    this.initGameState();
    this.initThemes();
  }
  /* Gets the initial state of the game */
  initGameState(){
    let onReply = function(data) {
      this.boardState = JSON.parse(data.target.response)[0];
      this.player_turn = JSON.parse(data.target.response)[1];
      this.initBoard();
      console.log('🕹️ Game initialized ');
    }.bind(this);
    server.request("start_board", onReply);
  }
  /* Initialize variables used for game logic */
  initBoard(){
    // Build board from game state
    this.board = new MyBoard(this.scene, this, this.boardState);
    // Defines current player turn 
    // 1 for player A, 2 for player B
    this.player_turn = 1;
    this.selected_piece = null;
    // Array of highlighted tiles
    this.highlighted = [];
    // Array of game moves
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
  /* Select different theme */
  changeTheme(id){
    this.currentTheme = new MySceneGraph(this.themes[id], this.scene);
  }
  /* Display the scene on the screen */
  display() {
    this.scene.clearPickRegistration();
    this.currentTheme.displayScene();
    if(this.board) this.board.display();
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
        //this.incrementMove(this.selected_piece, obj);
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
      piece.selected = true;
      this.selected_piece = piece;
      piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0);
      this.unhighlightTiles();
      this.highlightTiles(piece.tile.x, piece.tile.y);
    }
  }
  /* Moves one the pice one tile at a time */
  incrementMove(piece, tile){
    if(piece.isMoving()) return;
    let x = tile.x, y = tile.y;
    let px = piece.tile.x, py = piece.tile.y;
    let dx = x-px, dy = y-py;

    let BackTrackingList = [];
    for(let moves = piece.type; moves > 0; --moves){
      console.log('Moves Left: ', moves);
      let BackTrackingList_aux = [];
      server.incrementMove_req(moves, x, y, dx, dy, BackTrackingList, BackTrackingList_aux);
      BackTrackingList = BackTrackingList_aux;
    }
  }
  /* Move selected piece */
  movePiece(piece, tile){
    if(piece.isMoving()) return;
    let x = tile.x, y = tile.y;
    let px = piece.tile.x, py = piece.tile.y;
    let dx = x-px, dy = y-py;
    let chain = function(){
      piece.move(tile);
      this.moves.push(new MyGameMove(this.scene, this, piece.tile, tile, piece));
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, chain, false);

    let onValid = function(data){
      if(data.target.status == 200){
        if(data.target.response){
          this.boardState = JSON.parse(data.target.response);
          this.unhighlightTiles();
          this.highlightTiles(x,y);
          this.checkGameOver();
          this.switchTurn();
        }
      }
    }.bind(this);

    let onReply = function(data) {
      if(data.target.status == 200){
        if(data.target.response == 1){
          piece.animations[1].play();
          server.makeMove_req(this.boardState, px, py, x, y, onValid);
        }
      }
    }.bind(this);
    server.validMove_req(this.boardState, px, py, x, y, this.player_turn, onReply);
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
      else if(z == -1) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  1, 0,  0, piece.animations[0].reverse, false); }
      else if(z ==  1) { piece.animations[1] = new MyPieceAnimation(this.scene, 0.5, -1, 0,  0, piece.animations[0].reverse, false); }
    };
    // up -> move to tile -> down
    piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0, chain);
  }
  /* Highlight adjacent tiles to (x,y) */
  highlightTiles(x, y){
    let onReply = function(data) {
      if(data.target.status == 200){
          console.log(JSON.parse(data.target.response));
        let list = JSON.parse(data.target.response);
        if(list.length){
          let tile;
          for(let coords of list) {
            tile = this.board.getTile(coords[1], coords[0]);
            tile.highlight = true;
            this.highlighted.push(tile);
          }
        } else{
          console.log('🕹️ No moves');
        }
      }
    }.bind(this);
    server.possibleMoves_req(x, y, this.player_turn, this.boardState, onReply);
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
    if(this.board) this.board.update(t);
    /*
      TODO WIP
      If bot playing, do move
      interface will have dropdown
    */
  }
  /* Check if game as reached final state */
  checkGameOver(){
    let onReply = function(data) {
      if(data.target.status == 200){
        if(data.target.response != 3)
          console.log('🕹️ Game Over');
      }
    };
    server.gameOver_req(this.boardState, onReply);
  }
  switchTurn(){
    if(this.player_turn == 1) this.player_turn = 2;
    else this.player_turn = 1;

    this.scene.rotateCam(Math.PI);
  }

}

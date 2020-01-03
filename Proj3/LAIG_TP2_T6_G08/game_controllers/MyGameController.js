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
    this.selected_piece;
    this.selected_orig;
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
  /* Display scene to screen */
  display() {
    this.scene.clearPickRegistration();
    this.currentTheme.displayScene();
    if(this.board) this.board.display();
  }
  /* Update animations and make CPU moves */
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
  /* Switch turn to other player */
  switchTurn(){
    if(this.player_turn == 1) this.player_turn = 2;
    else this.player_turn = 1;

    this.scene.rotateCam(Math.PI);
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
  /* Treat picking data */
  OnObjectSelected(obj, id) {
    if(obj instanceof MyPiece){ // if pick piece
      this.selectPiece(obj);
    } else if(obj instanceof MyTile){ // if pick tile
      if(!this.selected_piece && obj.piece){  // if no piece selected and has piece
        this.selectPiece(obj.piece);
      } else if(this.selected_piece.moves_left == this.selected_piece.type && obj.piece) {  // if piece did not move and has piece
        this.deselectPiece(this.selected_piece);
        this.selectPiece(obj.piece);
      } else if(this.selected_piece) {  // if does not have piece
        this.movePiece(this.selected_piece, obj);
      }
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
  /* Treat selecting pieces */
  selectPiece(piece) {
    if(piece.player != this.player_turn) return;
    if(piece == this.selected_piece) this.finalMove(piece);
    else {
      piece.selected = true;
      piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0);
      this.selected_piece = piece;
      this.selected_orig = piece.tile;
    }
  }
  /* Treat deselecting pieces */
  deselectPiece(piece) {
    piece.selected = false;
    piece.animations[0].reverse();
    this.selected_piece = null;
    this.selected_orig = null;
  }
  /* Treat piece movement */
  movePiece(piece, tile) {
    if(this.board.isMoving()) return;
    if(piece.moves_left == 1) { // if final move
      this.finalMove(piece, tile);
    } else {  // if not final move
      this.normalMove(piece, tile);
    }
  }
  /* Move to adjacent tile */
  normalMove(piece, tile) {
    let x = tile.x, y = tile.y; // destination coords
    let px = piece.tile.x, py = piece.tile.y; // origin coords
    let dx = x-px, dy = y-py; // difference

    // move piece animation
    let chain = function(){
      piece.move(tile);
      piece.moves_left--;
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, chain);
    //this.unhighlightTiles();
    //this.highlightTiles(x,y); // highlight new moves
  }
  /* Move and update board */
  finalMove(piece, tile) {
    if(!tile) tile = piece.tile;
    let x = tile.x, y = tile.y; // destination coords
    let px = piece.tile.x, py = piece.tile.y; // origin coords
    let dx = x-px, dy = y-py; // difference
    let ox = this.selected_orig.x, oy = this.selected_orig.y; // first coords

    // move piece animation
    let chain = function(){
      piece.move(tile);
      this.deselectPiece(piece);
      piece.moves_left = piece.type;
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, chain);
    //this.unhighlightTiles();

    let onValid = function(data){
      if(data.target.status == 200){
        if(data.target.response){
          this.boardState = JSON.parse(data.target.response);
          this.moves.push(new MyGameMove(this.boardState, this.selected_orig, tile, piece));
          this.checkGameOver();
          this.switchTurn();
        }
      }
    }.bind(this);

    let onReply = function(data) {
      if(data.target.status == 200){
        if(data.target.response == 1){
          server.makeMove_req(this.boardState, ox, oy, x, y, onValid);
        }
      }
    }.bind(this);
    server.validMove_req(this.boardState, ox, oy, x, y, this.player_turn, onReply);
  }
  /* Highlight adjacent tiles to (x,y) */
  highlightTiles(x, y){
    this.highlighted = this.board.highlightAdj(x,y);
  }
  /* Remove all highlighted tiles */
  unhighlightTiles(){
    for(let tile of this.highlighted){
      tile.highlight = false;
    }
    this.highlighted = [];
  }
}

/*class MyGameController {
  constructor(scene) {
    this.scene = scene;
    this.initGameState();
    this.initThemes();
  }
  initGameState(){
    let onReply = function(data) {
      this.boardState = JSON.parse(data.target.response)[0];
      this.player_turn = JSON.parse(data.target.response)[1];
      this.initBoard();
      console.log('🕹️ Game initialized ');
    }.bind(this);
    server.request("start_board", onReply);
  }
  initBoard(){
    // Build board from game state
    this.board = new MyBoard(this.scene, this, this.boardState);
    // Defines current player turn 
    // 1 for player A, 2 for player B
    this.player_turn = 1;
    this.selected_piece;
    this.selected_orig;
    // Array of highlighted tiles
    this.highlighted = [];
    // Array of game moves
    this.moves = [];
  }
  initThemes(){
    // list of themes
    this.themes = [];
    this.themes.push('basic.xml');
    this.themes.push('stadium.xml');
    this.themes.push('hp_chess.xml');
    // theme selected
    this.currentTheme = new MySceneGraph(this.themes[1], this.scene);
  }
  changeTheme(id){
    this.currentTheme = new MySceneGraph(this.themes[id], this.scene);
  }
  display() {
    this.scene.clearPickRegistration();
    this.currentTheme.displayScene();
    if(this.board) this.board.display();
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
    if(obj instanceof MyPiece){
      this.selectPiece(obj);
    } else if(obj instanceof MyTile){
      if(obj.piece) { // if tile has a piece
        this.selectPiece(obj.piece);
      } else {
        if(this.selected_piece.moves_left == 1){  // if its final move do special stuff
          this.finalMove(this.selected_piece, obj);
        } else {
          this.movePiece(this.selected_piece, obj);
        }
      }
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
  selectPiece(piece){
    if(piece == this.selected_piece) {  // deselect piece if double-click
      if(this.selected_piece.moves_left < this.selected_piece.type) { // if selected piece was already moved
        this.finalMove(this.selected_piece, null);
      } else {  // if selected piece did not move re-select
        piece.selected = false;
        piece.animations[0].reverse(piece.clearAnimations);
        this.selected_piece = null;
        this.selected_orig = null;
        this.unhighlightTiles();
      }
    } else {
      if(piece.player == this.player_turn) {  // if it is player turn
        if(this.selected_piece){
          if(this.selected_piece.moves_left < this.selected_piece.type) { // if selected piece was already moved
            if(this.selected_piece.moves_left == 1){  // if its final move do special stuff
              this.finalMove(this.selected_piece, piece.tile);
            }
          } 
        } else {  // if selected did not move re-select
          if(this.selected_piece) { this.selected_piece.selected = false; this.selected_piece.animations[0].reverse(piece.clearAnimations); }
          piece.selected = true;
          this.selected_piece = piece;
          this.selected_orig = piece.tile;
          piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0);
          this.unhighlightTiles();
          this.highlightTiles(piece.tile.x, piece.tile.y);
        }
      }
    }
  }
  incrementMove(piece, tile, moves){
    if(piece.isMoving()) return;
    let x = tile.x, y = tile.y;
    let px = piece.tile.x, py = piece.tile.y;
    let dx = x-px, dy = y-py;

    if((dx <= 1 && dy == 0) || (dx == 0 && dy <= 1)){}
    else return;

    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, null, false);

    let BackTrackingList = [];

    let onValid = function(data){
      if(data.target.status == 200){
        if(data.target.response){
          this.boardState = JSON.parse(data.target.response);
          this.unhighlightTiles();
          this.highlightTiles(x,y);
          this.checkGameOver();
        }
      }
    }.bind(this);

    let onReply = function(data) {
      if(data.target.status == 200){
        if(data.target.response){
          BackTrackingList = JSON.parse(data.target.response);
          piece.animations[1].play();
          server.applyMoveIncrement_req(0, px, py, x, y, this.boardState, onValid);
        }
        else
          console.log('🕹️ Invalid move');
      }
    }.bind(this);

    server.incrementMove_req(moves, px, py, dx, dy, BackTrackingList, onReply);
  }
  finalMove(piece, tile, boost) {
    if(piece.isMoving()) return;  // if piece busy return
    if(!tile) tile = piece.tile;  // if no tile specified use piece current tile
    else if(tile.piece) { // if destination tile has piece then do special

    }

    let x = tile.x, y = tile.y;
    let px = this.selected_orig.x, py = this.selected_orig.y;
    let dx = x-px, dy = y-py;
    let chain = function(){
      piece.move(tile);
      this.moves.push(new MyGameMove(this.boardState, this.selected_orig, tile, piece));
      piece.animations[0].reverse();
      piece.moves_left = piece.type;
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, chain, false);

    let onValid = function(data){
      if(data.target.status == 200){
        if(data.target.response){
          this.boardState = JSON.parse(data.target.response);
          this.unhighlightTiles();
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
  movePiece(piece, tile){
    if(piece.isMoving()) return;
    let x = tile.x, y = tile.y;
    let px = piece.tile.x, py = piece.tile.y;
    let dx = x-px, dy = y-py;

    let chain = function(){
      piece.move(tile);
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, chain);

    this.unhighlightTiles();
    this.highlightTiles(x,y);
    piece.moves_left--;
  }
  undoMove(){
    // get move from array
    let prev_move = this.moves.pop(); if(!prev_move) return;

    let chain = function() {
      let x = prev_move.dest.x - prev_move.orig.x;
      let y = prev_move.dest.y - prev_move.orig.y;
      // move to tile -> down
      prev_move.piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  x, 0,  y, function() { prev_move.piece.animations[0].reverse; this.boardState = prev_move.board; }, false);
    }.bind(this);
    
    // up -> move to tile -> down
    prev_move.piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0, chain);
  }
  highlightTiles(x, y){
    let onReply = function(data) {
      if(data.target.status == 200){
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
  unhighlightTiles(){
    for(let tile of this.highlighted){
      tile.highlight = false;
    }
    this.highlighted = [];
  }
  update(t){
    if(this.board) this.board.update(t);
  }
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
*/
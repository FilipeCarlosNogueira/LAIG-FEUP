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
    if(obj instanceof MyPiece){                                           // if pick piece
      if(obj.player != this.player_turn) return;                            // if not current player return
      if(this.selected_piece) {                                             // if piece selected
        if(this.selected_piece.moves_left == 1) {                             // if last move -> do special move
          this.movePiece(this.selected_piece, obj.tile);
        } else if(this.selected_piece.moves_left == this.selected_piece.type) { // if did not move
          if(obj == this.selected_piece) {                                        // if click same -> deselect
            this.deselectPiece(this.selected_piece);
          } else {                                                                // if selected piece -> selected
            this.deselectPiece(this.selected_piece);
            this.selectPiece(obj);
          }
        }
      } else {                                                              // if no piece selected -> select
        this.selectPiece(obj);                                            
      }
    } else if(obj instanceof MyTile){                                                 // if pick tile
      if(this.selected_piece) {                                                         // if piece selected
        if(obj.piece) {                                                                   // if tile has piece
          if(this.selected_piece.moves_left == 1) {                                         // if last move -> do special move
            this.movePiece(this.selected_piece, obj);
          } else if(this.selected_piece.moves_left == this.selected_piece.type) {           // if did not move
            if(this.selected_piece == obj.piece) {                                            // if reselect -> deselect
              this.deselectPiece(this.selected_piece);
            } else {                                                                          // if select diferent -> re select
              this.deselectPiece(this.selected_piece);
              this.selectPiece(obj.piece);
            }
          }
        } else {
            this.movePiece(this.selected_piece, obj);
        }
      } else {                                                              // if no piece selected
        if(obj.piece) {                                                       // if tile has piece -> select it
          this.selectPiece(obj.piece);
        }
      }
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
  /* Treat selecting pieces */
  selectPiece(piece) {
    this.unhighlightTiles();
    if(piece.player != this.player_turn) 
      return;
    else if(piece == this.selected_piece) 
      this.finalMove(piece);
    else {
      piece.selected = true;
      piece.animations[0] = new MyPieceAnimation(this.scene, 0.5, 0, 0.5, 0);
      this.selected_piece = piece;
      this.selected_orig = piece.tile;
      this.highlightTiles(piece.tile.x,piece.tile.y);
    }
  }
  /* Treat deselecting pieces */
  deselectPiece(piece) {
    if(!piece) return;
    piece.selected = false;
    piece.animations[0].reverse();
    this.selected_piece = null;
    this.selected_orig = null;
    this.unhighlightTiles();
  }
  /* Treat piece movement */
  movePiece(piece, tile) {
    if(this.board.isMoving()) return;   // if board busy ignore
    if(piece.moves_left == 1) {         // if final move
      if(tile.piece)                      // if tile has piece
        return;                           // <--------------------- HERE ADD ROCKET BOOST
      else                                // if tile empty
        this.finalMove(piece, tile);
    } else {                            // if not final move
      this.normalMove(piece, tile);
    }
  }
  /* Move to adjacent tile */
  normalMove(piece, tile) {
    if(tile.piece) return;
    let x = tile.x, y = tile.y;               // destination coords
    let px = piece.tile.x, py = piece.tile.y; // origin coords
    let dx = x-px, dy = y-py;                 // difference
    if(Math.abs(dx) + Math.abs(dy) != 1) return; // only adjacent moves

    // move piece animation
    let chain = function(){
      piece.move(tile);
      piece.moves_left--;
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0,  dx, chain);
    this.unhighlightTiles();
    this.highlightTiles(x,y); // highlight new moves
  }
  /* Move and update board */
  finalMove(piece, tile) {
    if(!tile) return;
    let x = tile.x, y = tile.y;               // destination coords
    let px = piece.tile.x, py = piece.tile.y; // origin coords
    let dx = x-px, dy = y-py;                 // difference
    let ox = this.selected_orig.x, oy = this.selected_orig.y; // first coords
    if(Math.abs(dx) + Math.abs(dy) != 1) return; // only adjacent moves

    // move piece animation
    let chain = function(){
      piece.move(tile);
      this.deselectPiece(piece);
      piece.moves_left = piece.type;
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0, dx, chain);
    this.unhighlightTiles();

    let onValid = function(data){
      if(data.target.status == 200){
        if(data.target.response){
          this.boardState = JSON.parse(data.target.response);
          this.moves.push(new MyGameMove(this.boardState, this.selected_orig, tile, piece));
          this.checkGameOver();
          console.log('Player ' + (this.player_turn == 1 ? 'A' : 'B') + 
                      ' made move: ' + this.selected_orig.x + ',' + this.selected_orig.y + 
                      ' » '+ tile.x + ',' + tile.y);
          this.switchTurn();
        }
      }
    }.bind(this);

    let onReply = function(data) {
      if(data.target.status == 200){
        if(data.target.response == 1){  // valid move
          server.makeMove_req(this.boardState, ox, oy, x, y, onValid);
        } else { // invalid move go back
          let dx = x-ox, dy = y-oy; // difference
          if(piece.isMoving()) {
            let chain1 = piece.animations[1].chain;
            let chain2 = function(){
              piece.move(this.selected_orig);
              this.deselectPiece(piece);
              piece.moves_left = piece.type;
            }.bind(this);
            piece.animations[1].chain = chain2;
          } else {
            piece.animations[1] = new MyPieceAnimation(this.scene, 1,  dy, 0, dx);
          }
        }
      }
    }.bind(this);
    server.validMove_req(this.boardState, ox, oy, x, y, this.player_turn, onReply);
  }
  /* Highlight adjacent tiles to (x,y) */
  highlightTiles(x, y){
    this.highlighted = this.board.highlightAdj(x,y);
    for(let tile of this.highlighted){
      tile.highlight = true;
    }
  }
  /* Remove all highlighted tiles */
  unhighlightTiles(){
    for(let tile of this.highlighted){
      tile.highlight = false;
    }
    this.highlighted = [];
  }
}
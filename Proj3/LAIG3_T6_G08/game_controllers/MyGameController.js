class MyGameController {
  constructor(scene) {
    this.scene = scene;
    this.initGameState();
    this.initThemes();
  }
  /* Gets the initial state of the game */
  initGameState() {
    let onReply = function(data) {
      if(data.target.status == 200) {
        this.boardState = JSON.parse(data.target.response)[0];
        this.player_turn = JSON.parse(data.target.response)[1];
        this.initBoard();
        console.log('🕹️ Game initialized ');
      }
    }.bind(this);
    server.startGame_req(onReply);
  }
  /* Initialize variables used for game logic */
  initBoard() {
    // Build board from game state
    this.board = new MyBoard(this.scene, this, this.boardState);
    // Defines current player turn
    // 1 for player A, 2 for player B
    this.selected_piece;
    this.selected_orig;
    this.cpuA = false;
    this.cpuB = false;
    // Array of highlighted tiles
    this.highlighted = [];
    // Array of game moves
    this.moves = [];
  }
  /* Initialize all themes to be used */
  initThemes() {
    // list of themes
    this.themes = [];
    this.themes.push('basic.xml');
    this.themes.push('stadium.xml');
    this.themes.push('hp_chess.xml');
    // theme selected
    this.currentTheme = new MySceneGraph(this.themes[2], this.scene);
  }
  /* Display scene to screen */
  display() {
    this.scene.clearPickRegistration();
    this.currentTheme.displayScene();
    if(this.board) this.board.display();
  }
  /* Update animations and make CPU moves */
  update(t) {
    if(this.board) this.board.update(t);
    if(this.n_undo > 0) this.undo(true);
    if(!this.busy()) {
      if(this.cpuA && this.player_turn == 1) this.cpu_turn();
      if(this.cpuB && this.player_turn == 2) this.cpu_turn();
    }
  }
  /* Check if game as reached final state */
  checkGameOver() {
    let onReply = function(data) {
      if(data.target.status == 200) {
        if(data.target.response != 3) {
          console.log('🕹️ Game Over');
          this.reset();
        }
      }
    }.bind(this);
    server.gameOver_req(this.boardState, onReply);
  }
  /* Switch turn to other player */
  switchTurn() {
    if(this.player_turn == 1) this.player_turn = 2;
    else this.player_turn = 1;
    this.deselectPiece(this.selected_piece);

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
    if(this.busy()) return;
    if((this.player_turn == 1 && this.cpuA) || (this.player_turn == 2 && this.cpuB)) return;
    if(obj instanceof MyPiece) {                                           // if pick piece
      if(obj.player != this.player_turn) return;                            // if not current player return
      if(this.selected_piece) {                                             // if piece selected
        if(this.selected_piece.moves_left == 1) {                             // if last move -> do special move
          if(obj == this.selected_piece && obj.type == 1)                       // if did not move -> deselect
            this.deselectPiece(this.selected_piece);
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
    } else if(obj instanceof MyTile) {                                                 // if pick tile
      if(this.selected_piece) {                                                         // if piece selected
        if(obj.piece) {                                                                   // if tile has piece
          if(this.selected_piece.moves_left == 1) {                                         // if last move -> do special move
            if(obj.piece == this.selected_piece && obj.piece.type == 1)                       // if did not move -> deselect
              this.deselectPiece(this.selected_piece);
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
    if(piece.player != this.player_turn) {
      return;
    } else {
      piece.selected = true;
      piece.animations[0] = new MyPieceAnimation(this.scene, 0.2, 0, 0.5, 0);
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
    if(this.busy()) return;   // if board busy ignore
    if(this.prev_tile == tile) return;
    this.prev_tile = piece.tile;
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
    let chain = function() {
      piece.move(tile);
      piece.moves_left--;
      this.highlightTiles(x,y); // highlight new moves
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  dy, 0,  dx, chain);
    this.unhighlightTiles();
  }
  /* Move and update board */
  finalMove(piece, tile) {
    if(!tile) return;
    let x = tile.x, y = tile.y;               // destination coords
    let px = piece.tile.x, py = piece.tile.y; // origin coords
    let dx = x-px, dy = y-py;                 // difference
    let ox = this.selected_orig.x, oy = this.selected_orig.y, o = this.selected_orig, bs = this.boardState; // first coords
    if(Math.abs(dx) + Math.abs(dy) != 1) return; // only adjacent moves
    this.moves.push(new MyGameMove(bs, o, tile, piece));

    let onValid = function(data) {
      if(data.target.status == 200) {
        if(data.target.response) {
          this.boardState = JSON.parse(data.target.response);
          this.checkGameOver();
          console.log((this.player_turn == 1 ? '🟡 Player A' : '🟢 Player B') +
                      ' made move: ' + ox + ',' + oy +
                      ' » '+ x + ',' + y);
          this.switchTurn();
        }
      }
    }.bind(this);
    let onReply = function(data) {
      if(data.target.status == 200) {
        if(data.target.response == 1) {  // valid move
          server.makeMove_req(this.boardState, ox, oy, x, y, onValid);
        } else { // invalid move go back
          if(!piece.animations[0].chained) piece.animations[0].chain = function() { this.undo(true); }.bind(this);
        }
      }
    }.bind(this);

    // move piece animation
    let chain = function() {
      piece.move(tile);
      this.deselectPiece(piece);
      piece.moves_left = piece.type;
      server.validMove_req(this.boardState, ox, oy, x, y, this.player_turn, onReply);
    }.bind(this);
    piece.animations[1] = new MyPieceAnimation(this.scene, 0.5,  dy, 0, dx, chain);
    this.unhighlightTiles();
  }
  /* Highlight adjacent tiles to (x,y) */
  highlightTiles(x, y) {
    let list = this.board.highlightAdj(x,y);
    for(let tile of list) {
      if(tile != this.prev_tile && (this.player_turn - 1 ? (tile.x != 7) : (tile.x != 0)) && (!tile.piece)) {
        tile.highlight = true;
        this.highlighted.push(tile);
      }
      else if(tile.piece && this.selected_piece.moves_left == 1 && tile.piece.player == this.player_turn) {
        tile.highlight = true;
        this.highlighted.push(tile);
      }
    }
  }
  /* Remove all highlighted tiles */
  unhighlightTiles() {
    for(let tile of this.highlighted) {
      tile.highlight = false;
    }
    this.highlighted = [];
  }
  /* Set game to starting state */
  reset() {
    let i = this.moves.length;
    this.n_undo = i;
  }
  /* Undo last move */
  undo(ignoreTurn) {
    console.log(this.busy() || this.selected_piece);
    if(!this.moves.length) return;
    if(this.busy() || this.selected_piece) return;
    this.board.busy = true;
    let prev = this.moves.pop();
    let dx = prev.dest.x - prev.orig.x;
    let dy = prev.dest.y - prev.orig.y;

    // move piece animation
    let chain = function() {
      prev.piece.move(prev.orig);
      prev.piece.animations[0].reverse();
      this.boardState = prev.board;
      if(!ignoreTurn) {
        this.switchTurn();
        console.log((this.player_turn == 1 ? '🟡 Player A' : '🟢 Player B') +
                    ' undo move: ' + prev.orig.x + ',' + prev.orig.y +
                    ' « '+ prev.dest.x + ',' + prev.dest.y);
      }
      this.board.busy = false;
    }.bind(this);
    prev.piece.animations[1] = new MyPieceAnimation(this.scene, 0.5, -dy, 0, -dx, chain, false);
    prev.piece.animations[0] = new MyPieceAnimation(this.scene, 0.2, 0, 0.5, 0, function() {prev.piece.animations[1].play();}.bind(this));
    if(this.n_undo) this.n_undo--;
  }
  movie() {
    let backup = this.moves;
    this.reset();
    let i = 0;
    let piece, orig, dest, ox, oy, x, y, dx, dy;
    for(let move of backup) {

    }
    this.board.busy = false;
  }
  /* Asks prolog to play */
  cpu_turn() {
    this.board.busy = true;
    console.log('cpu');
    let onReply = function(data) {
      if(data.target.status == 200) {
        console.log(data.target.response);
        console.log('🤖 CPU move ');
        this.board.busy = false;
      }
    }.bind(this);
    server.CPUMove_req(this.boardState, this.player_turn, onReply);
  }
  busy() {
    return (this.board && (this.board.isMoving() || this.scene.isMoving()));
  }
  updateCPU(cpuA, cpuB) {
    if(cpuA == 'On') this.cpuA = true; else this.cpuA = false;
    if(cpuB == 'On') this.cpuB = true; else this.cpuB = false;
  }
}

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
    this.player_turn = 0;
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
      this.pieceSelected(obj);
    } else if(obj instanceof MyTile){
      if(obj.piece) this.pieceSelected(obj.piece);
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
  /* When piece is selected */
  pieceSelected(piece){
    // if it is the turn of this player
    if(piece.player == this.player_turn){
      // animate piece moving up
      // function()


    }
  }
}

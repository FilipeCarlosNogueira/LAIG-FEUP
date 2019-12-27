class MyGameController {
  constructor(scene) {
    this.scene = scene;
    this.board = new MyBoard(scene, this);
    this.themes = {
          'normal': 'normal.xml',
          'normal1': 'normal1.xml',
        };
    this.currentTheme = new MySceneGraph(this.themes['normal'], this.scene);
  }
  changeTheme(id){
    this.currentTheme = new MySceneGraph(this.themes[id], this.scene);
  }
  display() {
    this.scene.clearPickRegistration();
    this.board.display();
    this.scene.clearPickRegistration();
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
      obj.OnSelect();
    } else if(obj instanceof MyTile){
      obj.OnSelect();
    } else {
      console.log('ERROR with picking');
      console.log(obj);
    }
  }
}

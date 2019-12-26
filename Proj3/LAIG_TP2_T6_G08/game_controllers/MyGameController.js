class MyGameController {
  constructor(scene) {
    this.scene = scene;
    this.board = new MyBoard(scene, this);
  }
  display() {
    this.board.display();
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
    console.log('PICKING: ' + id);
    console.log(obj);
  }
}

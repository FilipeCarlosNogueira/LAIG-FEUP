class MyPieceAnimation extends MyAnimation {
  constructor(scene, duration, x, y, z) {
    super(scene);
    this.x = x;
    this.y = y;
    this.z = z;
    this.duration = duration * 1000;
    this.time = 0;
  }
  update(t){
    if(this.finished) return;
    mat4.identity(this.matrix);
    this.time += t;
    let translate;
    if(this.time > this.duration){
      this.finished = 1;
      translate = [this.x, this.y, this.z];
      mat4.translate(this.matrix, this.matrix, translate);
      return;
    }
    let ratio = (this.time / this.duration) * (this.time / this.duration);
    translate = [ratio  * this.x, ratio * this.y, ratio * this.z];
    mat4.translate(this.matrix, this.matrix, translate);
  }
  finish(){
    this.finished = 1;
    let translate = [this.x, this.y, this.z];
    mat4.translate(this.matrix, this.matrix, translate);
    return;
  }
}

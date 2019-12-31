class MyPieceAnimation extends MyAnimation {
  constructor(scene, duration, x, y, z) {
    super(scene);
    this.x = x;     this.y = y;     this.z = z;
    this.duration = duration * 1000;
    this.time = 0;
  }
  update(t){
    if(this.finished) return;
    mat4.identity(this.matrix);
    this.time += t;
    let translate;
    if(this.time > this.duration){
      this.finished = true;
      translate = [this.x, this.y, this.z];
      mat4.translate(this.matrix, this.matrix, translate);
      return;
    }
    let r = (this.time / this.duration);
    let ratio = -1 * r * r * r + r * r + r; // -r^3 + r^2 + r
    translate = [ratio  * this.x, ratio * this.y, ratio * this.z];
    mat4.translate(this.matrix, this.matrix, translate);
  }
  finish(){
    this.finished = true;
    let translate = [this.x, this.y, this.z];
    mat4.translate(this.matrix, this.matrix, translate);
    return;
  }
  // TODO WIP animation reverse
  reverse(){
  }
}

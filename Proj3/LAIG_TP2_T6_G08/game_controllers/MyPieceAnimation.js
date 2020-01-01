class MyPieceAnimation extends MyAnimation {
  constructor(scene, duration, x, y, z, chain, autoplay=true) {
    super(scene);
    this.sx = 0;
    this.sy = 0;
    this.sz = 0;
    this.x = x;
    this.y = y;
    this.z = z;
    this.duration = duration * 1000;
    this.time = 0;
    this.chain = chain;
    this.chained = !autoplay;
    this.finished = false;
  }
  play(){
    this.chained = false;
  }
  update(t){
    if(this.chained) return;
    else if(this.finished) { this.atFinish(); return; }
    mat4.identity(this.matrix);
    this.time += t;
    let translate;
    if(this.time > this.duration){
      this.finished = true;
      if(this.sx || this.sy || this.sz) translate = [0, 0, 0];
      else translate = [this.x, this.y, this.z];
      mat4.translate(this.matrix, this.matrix, translate);
      return;
    }
    let r = (this.time / this.duration);
    let ratio = -1 * r * r * r + r * r + r; // -r^3 + r^2 + r
    if(this.sx || this.sy || this.sz) translate = [this.sx - ratio  * this.x, this.sy - ratio * this.y, this.sz - ratio * this.z];
    else translate = [ratio  * this.x, ratio * this.y, ratio * this.z];
    mat4.translate(this.matrix, this.matrix, translate);
  }
  finish(){
    this.finished = true;
    let translate = [this.x, this.y, this.z];
    mat4.translate(this.matrix, this.matrix, translate);
    return;
  }
  reverse(chain){
    this.sx = this.x;
    this.sy = this.y;
    this.sz = this.z;
    this.time = 0;
    this.chain = chain;
    this.chained = false;
    this.finished = false;
  }
  atFinish(){
    if(this.chain){
      if(this.chain instanceof MyPieceAnimation){
        this.chain.play();
      } else {
        this.chain();
      }
    }
    this.chained = true;
  }
}

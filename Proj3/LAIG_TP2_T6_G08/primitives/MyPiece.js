class MyPiece extends CGFobject {
  constructor(scene, id, gameController, tile, type, player) {
    super(scene);
    this.uniqueID = id;
    this.gameController = gameController;
    this.setTile(tile);
    this.type = type;
    this.moves_left = type;
    this.player = player;
    this.selected = false;
    this.initBuffers();
    this.animations = [];
  }
  /* Build the primitive */
  initBuffers() {
    let x_off, y_off;
    if(this.type == 1) {
      x_off = 0.3; y_off = 0.5;
    } else if(this.type == 2) {
      x_off = 0.4; y_off = 0.6;
    } else if(this.type == 3) {
      x_off = 0.5; y_off = 0.75;
    } else {
      console.log('Invalid type of piece: ' + this.type);
    }
    this.vertices = [
      x_off,  0.0,  x_off,  // 0
      x_off,  0.0, -x_off,  // 1
      0.0,  -y_off,  0.0,   // 2
      x_off,  0.0, -x_off,  // 3
     -x_off,  0.0, -x_off,  // 4
      0.0,  -y_off,  0.0,   // 5
     -x_off,  0.0, -x_off,  // 6
     -x_off,  0.0,  x_off,  // 7
      0.0,  -y_off,  0.0,   // 8
     -x_off,  0.0,  x_off,  // 9
      x_off,  0.0,  x_off,  // 10
      0.0,  -y_off,  0.0,   // 11

       x_off,  0.0,  x_off, // 12
       x_off,  0.0, -x_off, // 13
       0.0,  y_off,  0.0,   // 14
       x_off,  0.0, -x_off, // 15
      -x_off,  0.0, -x_off, // 16
       0.0,  y_off,  0.0,   // 17
      -x_off,  0.0, -x_off, // 18
      -x_off,  0.0,  x_off, // 19
       0.0,  y_off,  0.0,   // 20
      -x_off,  0.0,  x_off, // 21
       x_off,  0.0,  x_off, // 22
       0.0,  y_off,  0.0,   // 23
    ];
    this.indices = [];
    this.indices.push( 0, 2, 1);
    this.indices.push( 3, 5, 4);
    this.indices.push( 6, 8, 7);
    this.indices.push( 9,11,10);
    this.indices.push(13,14,12);
    this.indices.push(16,17,15);
    this.indices.push(19,20,18);
    this.indices.push(22,23,21);

    this.normals = [
      x_off, -y_off, 0,
      x_off, -y_off, 0,
      x_off, -y_off, 0,
      0, -y_off, -x_off,
      0, -y_off, -x_off,
      0, -y_off, -x_off,
      -x_off, -y_off, 0,
      -x_off, -y_off, 0,
      -x_off, -y_off, 0,
      0, -y_off, x_off,
      0, -y_off, x_off,
      0, -y_off, x_off,

      x_off, y_off, 0,
      x_off, y_off, 0,
      x_off, y_off, 0,
      0, y_off, -x_off,
      0, y_off, -x_off,
      0, y_off, -x_off,
      -x_off, y_off, 0,
      -x_off, y_off, 0,
      -x_off, y_off, 0,
      0, y_off, x_off,
      0, y_off, x_off,
      0, y_off, x_off,
    ]
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    this.enable
  }
  /* Update texture coords according to texture */
  /* TODO WIP */
  updateTexCoords(length_t, length_s){}
  /* Set the tile the piece is on currently */
  setTile(tile){
    if(this.tile) this.tile.unset();
    this.tile = tile;
    this.tile.setPiece(this);
  }
  /* Move piece to tile */
  move(tile){
    this.setTile(tile);
    this.animations.pop();
  }
  clearAnimations(){
    this.animations = [];
  }
  isMoving(){
    for(let anim of this.animations)
      if(!anim.finished && !anim.chained)
        return true;
    return false;
  }
  /* Set piece id, set its position and display the piece */
  display(){
    this.scene.registerForPick(this.uniqueID, this);
    this.scene.pushMatrix();
    for(let anim of this.animations) anim.apply();
    this.scene.translate(-2.5 + this.tile.y, 1.8, -3.5 + this.tile.x);
    super.display();
    this.scene.popMatrix();
    this.scene.clearPickRegistration();
  }
}

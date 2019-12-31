class MyPiece extends CGFobject {
  constructor(scene, id, gameController, tile, type, player) {
    super(scene);
    this.uniqueID = id;
    this.gameController = gameController;
    this.setTile(tile);
    this.type = type;
    this.player = player;
    this.selected = false;
    this.initBuffers();
    this.animations = [];
  }
  /* Build the primitive */
  initBuffers() {
    let x_off, y_off;
    if(this.type == 1) {
      x_off = 0.3; y_off = 1;
    } else if(this.type == 2) {
      x_off = 0.4; y_off = 1.2;
    } else if(this.type == 3) {
      x_off = 0.5; y_off = 1.5;
    } else {
      console.log('Invalid type of piece: ' + this.type);
    }
    this.vertices = [
       x_off,  0.0,  x_off, // 0
       x_off,  0.0, -x_off, // 1
      -x_off,  0.0, -x_off, // 2
      -x_off,  0.0,  x_off, // 3
       x_off,  0.0,  x_off, // 4
       x_off,  0.0, -x_off, // 5
       0.0,  y_off,  0.0, // 6
       x_off,  0.0, -x_off, // 7
      -x_off,  0.0, -x_off, // 8
       0.0,  y_off,  0.0, // 9
      -x_off,  0.0, -x_off, // 10
      -x_off,  0.0,  x_off, // 11
       0.0,  y_off,  0.0, // 12
      -x_off,  0.0,  x_off, // 13
       x_off,  0.0,  x_off, // 14
       0.0,  y_off,  0.0, // 15
    ];
    this.indices = [];
    this.indices.push( 0, 2, 1);
    this.indices.push( 0, 3, 2);
    this.indices.push( 5, 6, 4);
    this.indices.push( 8, 9, 7);
    this.indices.push(11,12,10);
    this.indices.push(14,15,13);
    this.normals = [
      0, -y_off, 0,
      0, -y_off, 0,
      0, -y_off, 0,
      0, -y_off, 0,
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
    this.tile = tile;
    this.tile.setPiece(this);
  }
  /* Set piece id, set its position and display the piece */
  display(){
    this.scene.registerForPick(this.uniqueID, this);
    this.scene.pushMatrix();
    for(let anim of this.animations) anim.apply();
    this.scene.translate(-2.5 + this.tile.y, 1, -2.5 + this.tile.x);
    super.display();
    this.scene.popMatrix();
    this.scene.clearPickRegistration();
  }
}

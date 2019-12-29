class MyPiece extends CGFobject {
  constructor(scene, id, gameController, tile) {
    super(scene);
    this.initBuffers();
    this.uniqueID = id;
    this.gameController = gameController;
    this.tile = tile;
  }
  initBuffers() {
    let x_off = 0.5, y_off = 1.5;
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
  updateTexCoords(length_t, length_s){}
  setTile(tile){
    this.tile = tile;
    this.tile.setPiece(this);
  }
  display(){
    this.scene.registerForPick(this.uniqueID, this);
    this.scene.pushMatrix();
    this.scene.translate(this.tile.y, 1, this.tile.x);
    super.display();
    this.scene.popMatrix();
    this.scene.clearPickRegistration();
  }
  OnSelect(){
    console.log(this.uniqueID);
  }
}

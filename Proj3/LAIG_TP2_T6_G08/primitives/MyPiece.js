class MyPiece extends CGFobject {
  constructor(scene, id, gameController, tile) {
    super(scene);
    this.initBuffers();
    this.uniqueID = id;
    this.gameController = gameController;
    this.tile = tile;
  }
  initBuffers() {
    this.vertices = [
       0.5,  0.0,  0.5, // 0
       0.5,  0.0, -0.5, // 1
      -0.5,  0.0, -0.5, // 2
      -0.5,  0.0,  0.5, // 3

       0.5,  0.0,  0.5, // 4
       0.5,  0.0, -0.5, // 5
       0.0,  1.5,  0.0, // 6

       0.5,  0.0, -0.5, // 7
      -0.5,  0.0, -0.5, // 8
       0.0,  1.5,  0.0, // 9

      -0.5,  0.0, -0.5, // 10
      -0.5,  0.0,  0.5, // 11
       0.0,  1.5,  0.0, // 12

      -0.5,  0.0,  0.5, // 13
       0.5,  0.0,  0.5, // 14
       0.0,  1.5,  0.0, // 15
    ];
    this.indices = [];
    this.indices.push( 0, 2, 1);
    this.indices.push( 0, 3, 2);
    this.indices.push( 5, 6, 4);
    this.indices.push( 8, 9, 7);
    this.indices.push(11,12,10);
    this.indices.push(14,15,13);
    this.normals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
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

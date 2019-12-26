class MyPiece extends CGFobject {
  constructor(scene, id, gameController) {
    super(scene);
    this.initBuffers();
    this.uniqueID = id;
    this.gameController = gameController;
  }
  initBuffers() {
    this.vertices = [
       0.5,  0.5, 0,
       0.5, -0.5, 0,
      -0.5, -0.5, 0,
      -0.5,  0.5, 0,
       0.5,  0.5, 0,
       0.5, -0.5, 0,
       0.0,  0.0, 1.5,
       0.5, -0.5, 0,
      -0.5, -0.5, 0,
       0.0,  0.0, 1.5,
      -0.5, -0.5, 0,
      -0.5,  0.5, 0,
       0.0,  0.0, 1.5,
      -0.5,  0.5, 0,
       0.5,  0.5, 0,
       0.0,  0.0, 1.5,
    ];
    this.indices = [];
    this.indices.push(0,1,2);
    this.indices.push(0,2,3);
    this.indices.push( 4, 6, 5);
    this.indices.push( 7, 9, 8);
    this.indices.push(10,12,11);
    this.indices.push(13,15,14);
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
}

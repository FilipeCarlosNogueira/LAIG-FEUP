class MyPiece extends CGFobject {
  constructor(scene, id, gameController) {
    super(scene);
    this.initBuffers();
    this.uniqueID = id;
    this.gameController = gameController;
  }
  initBuffers() {
    this.vertices = [
      // base
       0.5,  0.5, 0,    // 0
       0.5, -0.5, 0,    // 1
      -0.5, -0.5, 0,    // 2
      -0.5,  0.5, 0,    // 3

      // sides
       0.5,  0.5, 0,    // 4
       0.5, -0.5, 0,    // 5
       0.0,  0.0, 1.5,    // 6

       0.5, -0.5, 0,    // 7
      -0.5, -0.5, 0,    // 8
       0.0,  0.0, 1.5,    // 9

      -0.5, -0.5, 0,    // 10
      -0.5,  0.5, 0,    // 11
       0.0,  0.0, 1.5,    // 12

      -0.5,  0.5, 0,    // 13
       0.5,  0.5, 0,    // 14
       0.0,  0.0, 1.5,    // 15
    ];
    this.indices = [];
    // base
    this.indices.push(0,1,2);
    this.indices.push(0,2,3);
    // sides
    this.indices.push( 4, 6, 5);
    this.indices.push( 7, 9, 8);
    this.indices.push(10,12,11);
    this.indices.push(13,15,14);


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    this.enable
  }

  updateTexCoords(length_t, length_s){}
}

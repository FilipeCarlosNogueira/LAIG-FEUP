class MyRectangle extends CGFobject {
  constructor(scene, id, x1, x2, y1, y2) {
    super(scene);
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [
      this.x1, this.y1, 0,
      this.x2, this.y1, 0,
      this.x1, this.y2, 0,
      this.x2, this.y2, 0,

      this.x1, this.y1, 0,
      this.x2, this.y1, 0,
      this.x1, this.y2, 0,
      this.x2, this.y2, 0,
    ];
    this.indices = [0, 1, 2, 1, 3, 2, 
                    6, 5, 4, 6, 7, 5];
    this.normals = [
                    0, 0, 1, 
                    0, 0, 1, 
                    0, 0, 1, 
                    0, 0, 1,

                    0, 0, -1, 
                    0, 0, -1, 
                    0, 0, -1, 
                    0, 0, -1,
                    ];
    this.texCoords = [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0];
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  updateTexCoords(length_t, length_s){
    this.texCoords = [0, length_t, length_s, length_t, 0, 0, length_s, 0, 0, length_t, length_s, length_t, 0, 0, length_s, 0];
    this.updateTexCoordsGLBuffers();
  }
}

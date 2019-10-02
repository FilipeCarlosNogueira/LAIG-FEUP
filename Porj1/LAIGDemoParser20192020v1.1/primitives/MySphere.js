class MySphere extends CGFobject {
  constructor(scene, id, radius, slices, stacks) {
    super(scene);
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // variables
    let t = 0, f = 0, deltaT = Math.PI / (2 * this.stacks), deltaF = (Math.PI * 2) / this.slices;
    let x = 0, y = 0, z = 0;

    // vertices, normals and texture
    for (let j = 0; j <= this.stacks; j++) {
        for (let i = 0; i <= this.slices; i++) {
            f = i * deltaF;



        }
    }

    // indices
    for (let j = 0; j < this.stacks; j++) {
      for (let i = 0; i <= this.slices; i++) {}
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  updateBuffers(complexity) {
    this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

    // reinitialize buffers
    this.initBuffers();
    this.initNormalVizBuffers();
  }
}

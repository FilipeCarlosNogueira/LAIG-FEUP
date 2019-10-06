class MyTorus extends CGFobject {
  constructor(scene, id, inner, outer, slices, loops) {
    super(scene);
    this.slices = slices;
    this.loops = loops;
    this.inner = inner;
    this.outer = outer;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // variables
    let deltaF = (Math.PI * 2)/this.loops, deltaT = (Math.PI * 2) / this.slices, cF = 0, cT = 0, sF = 0, sT = 0;
    let x = 0, y = 0, z = 0;
    // vertices, normals and texture
    for (let j = 0; j <= this.loops; j++) {
      cF = Math.cos(deltaF * j);
      sF = Math.sin(deltaF * j);
      for (let i = 0; i <= this.slices; i++) {
        cT = Math.cos(deltaT * i);
        sT = Math.sin(deltaT * i);

        x = (this.outer + this.inner * cT) * cF;
        y = (this.outer + this.inner * cT) * sF;
        z = this.inner * sT;

        this.vertices.push(x,y,z);
        this.texCoords.push(i/this.slices, j/this.loops);
        this.normals.push(cT * cF, cT * sF, sT);
      }
    }

    // indices
    let b1 = 0, b2 = 0, b3 = 0;
    for (let j = 0; j < this.loops; j++) {
      b1 = j * this.slices + j;
      b2 = (j + 1) * this.slices + j + 1;
      b3 = (j + 2) * this.slices + j + 2;

      for (let i = 0; i < this.slices; i++) {
        this.indices.push((i + b1) % b2, (i + b2) % b3, (i + 1 + b1) % b2);
        this.indices.push((i + 1 + b1) % b2, (i + b2) % b3, (i + 1 + b2) % b3);
      }
    }



    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  updateBuffers(complexity) {
    this.slices = 3 +
        Math.round(
            9 * complexity);  // complexity varies 0-1, so slices varies 3-12

    // reinitialize buffers
    this.initBuffers();
    this.initNormalVizBuffers();
  }
}

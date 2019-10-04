class MyTorus extends CGFobject {
  constructor(scene, id, inner, outer, slices, loops) {
    super(scene);
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
  }

  initBuffers() {
    this.indices = [];
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];

    // variables
    let deltaF = 2 * Math.PI / this.slices, deltaT = 2 * Math.PI / this.loops;
    let cT, cF, sT, sF;

    for (let j = 0; j <= this.loops; j++) {
      cT = Math.cos(deltaT * j);
      sT = Math.sin(deltaT * j);
      for (let i = 0; i <= this.slices; i++) {
        cF = Math.cos(deltaF * i);
        sF = Math.sin(deltaF * i);

        this.vertices.push((this.outer + this.inner * cT) * cF, (this.outer + this.inner * cT) * sF, this.inner * sT);
        this.texCoords.push(i / this.slices, j / this.loops);
        this.normals.push(cF * cT, cT * sF, sT);
      }
    }

    for (let j = 0; j < this.loops; j++) {
      for (let i = 0; i < this.slices; i++) {
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  };
}
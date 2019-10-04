class MyCylinder extends CGFobject {
  constructor(scene, id, slices, stacks, radiusTop, radiusBase, height) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.radiusTop = radiusTop;
    this.radiusBase = radiusBase;
    this.height = height;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // variables
    let ang = 0, deltaAng = (2 * Math.PI) / this.slices;
    let ca = 0, sa = 0, z = 0, deltaZ = this.height / this.stacks;
    let radius = this.radiusBase,
        deltaRadius = (this.radiusTop - this.radiusBase) / this.stacks;

    // vertices, normals and texture
    for (let j = 0; j <= this.stacks; j++) {
      z = deltaZ * j;
      radius = this.radiusBase + deltaRadius * j;
      for (let i = 0; i <= this.slices; i++) {
        ang = deltaAng * i;
        ca = Math.cos(ang);
        sa = Math.sin(ang);

        this.vertices.push(ca * radius, sa * radius, z);
        this.normals.push(ca, sa, -1 / (this.radiusTop - this.radiusBase));
        this.texCoords.push(i / this.slices, (this.stacks - j) / this.stacks);
      }
    }

    // indices
    let b1 = 0, e1 = 0, b2 = 0, e2 = 0;
    for (let j = 0; j < this.stacks; j++) {
      b1 = j * this.slices + j;
      e1 = this.slices * (j + 1) + j + 1;
      b2 = (j + 1) * this.slices + j + 1;
      e2 = this.slices * (j + 2) + j + 2;

      for (let i = 0; i <= this.slices; i++) {
        this.indices.push((i + b1) % e1, (i + 1 + b1) % e1, (i + b2) % e2);
        this.indices.push((i + 1 + b1) % e1, (i + 1 + b2) % e2, (i + b2) % e2);
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

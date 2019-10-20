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
        this.normals.push(ca, sa, (this.radiusTop - this.radiusBase));
        this.texCoords.push(i / this.slices, (this.stacks - j) / this.stacks);
      }
    }

    // indices
    let b1 = 0, b2 = 0, b3 = 0;
    for (let j = 0; j < this.stacks; j++) {
      b1 = j * this.slices + j;
      b2 = (j + 1) * this.slices + j + 1;
      b3 = (j + 2) * this.slices + j + 2;

      for (let i = 0; i <= this.slices; i++) {
        this.indices.push((i + b1) % b2, (i + 1 + b1) % b2, (i + b2) % b3);
        this.indices.push((i + 1 + b1) % b2, (i + 1 + b2) % b3, (i + b2) % b3);
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

  updateTexCoords(length_t, length_s){
    this.texCoords = [];

    for (let j = 0; j <= this.stacks; j++) {
      for (let i = 0; i <= this.slices; i++) {

        this.texCoords.push( ( i / length_s) / this.slices, ((this.stacks - j) / length_t) / this.stacks);

      }
    }
    this.updateTexCoordsGLBuffers();
  }
}

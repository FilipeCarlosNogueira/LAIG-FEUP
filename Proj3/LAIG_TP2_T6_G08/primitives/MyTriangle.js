class MyTriangle extends CGFobject {
  constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    super(scene);
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [
      this.x1, this.y1, this.z1,
      this.x2, this.y2, this.z2,
      this.x3, this.y3, this.z3
    ];
    this.indices = [0, 1, 2, 2, 1, 0];
    this.A = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
    this.B = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
    this.C = Math.sqrt(Math.pow(this.x3 - this.x3, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));
    this.cosA = (Math.pow(this.A, 2) - Math.pow(this.B, 2) + Math.pow(this.C, 2)) / (2 * this.A * this.C);
    this.sinA = Math.sqrt(1 - Math.pow(this.cosA, 2));
    let AB = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
    let AC = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];
    let n = [
      (AB[1] * AC[2]) - (AC[1] * AB[2]),
      (AB[2] * AC[0]) - (AC[2] * AB[0]),
      (AB[0] * AC[1]) - (AC[0] * AB[1])
    ];
    this.normals = [n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2]];
    this.texCoords = [
      0, 0,
      this.A, 0,
      this.C * this.cosA, this.C * this.sinA,
    ];
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  updateTexCoords(length_s, length_t) {
    this.texCoords = [
      0, 0,
      this.A / length_s, 0,
      this.C * this.cosA / length_s, this.C * this.sinA / length_t,
    ];
    this.updateTexCoordsGLBuffers();
  }
}

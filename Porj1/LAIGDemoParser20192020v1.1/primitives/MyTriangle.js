/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2; 
		this.x3 = x3;
		this.y3 = y3;
		this.initBuffers();
	}
	initBuffers() {
		//x, z, y
		//A, B, C
		//red - x; blue - y; green - z;
		this.vertices = [
			this.x1, this.y1, 0,	//A
			this.x2, this.y2, 0,	//B
			this.x3, this.y3, 0	//C
		];

		//Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2,
            2, 1, 0
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param uDivs - the number of divisions in the u direction.
 * @param vDivs - the number of divisions in the v direction.
 */
class MyPlane extends CGFobject {

	constructor(scene, id, uDivs, vDivs) {
		super(scene);
		this.uDivs = uDivs;
		this.vDivs = vDivs;
		this.degree1 = 1; /* degree on U: 2 control vertexes U */ 
		this.degree2 = 1; /* degree on V: 2 control vertexes on V */
		
		this.controlVertexes = [	
			/* U = 0 */
			[ /* V = 0..1 */
				[-0.5, 0.0, 0.5, 1 ],	// [x, y, z, CurveDegree]
				[-0.5, 0.0, -0.5, 1 ]	// [x, y, z, CurveDegree]
			], 

			/* U = 1 */ 
			[ /* V = 0..1 */
				[ 0.5, 0.0, 0.5, 1 ],	// [x, y, z, CurveDegree]
				[ 0.5,  0.0, -0.5, 1 ]	// [x, y, z, CurveDegree]
			]
		];

		this.obj;

		this.makeSurface(this.degree1, this.degree2, this.uDivs, this.vDivs, this.controlVertexes);
	}

	makeSurface(degree1, degree2, uDivs, vDivs, controlvertexes) {
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		// must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		this.obj = new CGFnurbsObject(this.scene, uDivs, vDivs, nurbsSurface);
	}

	display() { 
		this.obj.display(); 
	}

	updateTexCoords(length_s, length_t) {};
};
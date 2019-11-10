/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param uDivs - the number of divisions in the u direction.
 * @param vDivs - the number of divisions in the v direction.
 * @param degree1 - degree on U.
 * @param degree2 - degree on V.
 * @param controlVertexes - object that contains a function getPoint(u, v) that is used to define the coordinates of each point generated on the surface (gets u, v as parameters, returns a 3D vector). Creates the NURBS object.
 */
class MyPatch extends CGFobject {

	constructor(scene, id, uDivs, vDivs, degree1, degree2, controlVertexes) {
		super(scene);
		this.uDivs = uDivs;
		this.vDivs = vDivs;
		this.degree1 = degree1;
		this.degree2 = degree2;
		this.controlVertexes = controlVertexes;

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
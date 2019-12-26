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
		this.obj = new CGFnurbsObject(this.scene, uDivs, vDivs, nurbsSurface);
	}
	display() {
		this.obj.display();
	}
	updateTexCoords(length_s, length_t) {};
};

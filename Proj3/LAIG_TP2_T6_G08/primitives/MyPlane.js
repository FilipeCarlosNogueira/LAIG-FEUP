class MyPlane extends CGFobject {
	constructor(scene, id, uDivs, vDivs) {
		super(scene);
		this.uDivs = uDivs;
		this.vDivs = vDivs;
		this.degree1 = 1;
		this.degree2 = 1;
		this.controlVertexes = [
			[
				[-0.5, 0.0, 0.5, 1 ],
				[-0.5, 0.0, -0.5, 1 ]
			],
			[
				[ 0.5, 0.0, 0.5, 1 ],
				[ 0.5,  0.0, -0.5, 1 ]
			]
		];
		this.obj;
		this.makeSurface(this.degree1, this.degree2, this.uDivs, this.vDivs, this.controlVertexes);
	}
	makeSurface(degree1, degree2, uDivs, vDivs, controlvertexes) {
		let nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, uDivs, vDivs, nurbsSurface);
	}
	display() {
		this.obj.display();
	}
	updateTexCoords(length_s, length_t) {};
};

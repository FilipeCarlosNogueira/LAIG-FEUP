class MyTile extends CGFobject {
	constructor(scene, id, gameController, x, y) {
		super(scene);
    this.uniqueID = id;
    this.gameController = gameController;
    this.piece = null;
		this.x = x;
		this.y = y;
		this.highlight = false;
		this.degree1 = 1;
		this.degree2 = 1;
		this.controlVertexes = [
			[[-0.5, 0.0, 0.5, 1 ], [-0.5, 0.0, -0.5, 1 ]],
			[[ 0.5, 0.0, 0.5, 1 ], [ 0.5,  0.0, -0.5, 1 ]]
		];
		this.obj;
		this.makeSurface(this.degree1, this.degree2, 10, 10, this.controlVertexes);
	}
	makeSurface(degree1, degree2, uDivs, vDivs, controlvertexes) {
		let nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, uDivs, vDivs, nurbsSurface);
	}
	display() {
		this.scene.registerForPick(this.uniqueID, this);
    this.scene.pushMatrix();
    this.scene.translate(-2.5 + this.y, 1, -3.5 + this.x);
		this.obj.display();
		this.scene.popMatrix();
		this.scene.clearPickRegistration();
	}
	setPiece(piece){
		this.piece = piece;
	}
	unset(){
		this.piece = null;
	}
}

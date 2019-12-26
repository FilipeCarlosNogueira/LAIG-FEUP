class MyCylinder2 extends CGFobject {
    constructor(scene, id, slices, stacks, radiusTop, radiusBase, height) {
      super(scene);
      this.id = id;
      this.divsX = slices;
      this.divsY = stacks;
      this.radiusTop = radiusTop;
      this.radiusBase = radiusBase;
      this.height = height;
      this.initBuffers();
      this.makePatches();
    }
    initBuffers(){
        this.controlVertexesRight = 	[
            [
                [-this.radiusBase, 0.0, 0.0, 1],
                [-this.radiusBase, (this.radiusBase/0.75), 0.0, 1],
                [this.radiusBase, (this.radiusBase/0.75), 0.0, 1],
                [this.radiusBase, 0.0, 0.0, 1]
            ],
            [
                [-this.radiusTop, 0.0, this.height, 1],
                [-this.radiusTop, (this.radiusTop/0.75), this.height, 1],
                [this.radiusTop, (this.radiusTop/0.75), this.height, 1],
                [this.radiusTop, 0.0, this.height, 1]
            ]
        ];
        this.controlVertexesLeft = 	[
            [
                [this.radiusBase, 0.0, 0.0, 1],
                [this.radiusBase, -(this.radiusBase/0.75), 0.0, 1],
                [-this.radiusBase, -(this.radiusBase/0.75), 0.0, 1],
                [-this.radiusBase, 0.0, 0.0, 1]
            ],
            [
                [this.radiusTop, 0.0, this.height, 1],
                [this.radiusTop, -(this.radiusTop/0.75), this.height, 1],
                [-this.radiusTop, -(this.radiusTop/0.75), this.height, 1],
                [-this.radiusTop, 0.0, this.height, 1]
            ]
        ];
    }
    makePatches(){
        this.right = new MyPatch(this.scene, this.id, this.divsX, this.divsY, 1, 3, this.controlVertexesRight);
        this.left = new MyPatch(this.scene, this.id, this.divsX, this.divsY, 1, 3, this.controlVertexesLeft);
    }
    display(){
        this.right.display();
        this.left.display()
    }
    updateTexCoords(length_s, length_t) {};
}

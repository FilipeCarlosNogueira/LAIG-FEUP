/**
 * MyCylinder2
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices
 * @param stacks
 * @param radiusTop
 * @param radiusBase
 * @param height
 */
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
        // half of cylinder
        this.controlVertexesRight = 	[
            // U = 0
            [
                // V = 0
                [-this.radiusBase, 0.0, 0.0, 1],
                // V = 1
                [-this.radiusBase, (this.radiusBase/0.75), 0.0, 1],
                // V = 2
                [this.radiusBase, (this.radiusBase/0.75), 0.0, 1],
                // V = 3
                [this.radiusBase, 0.0, 0.0, 1]
            ],
            // U = 1
            [   
                // V = 0
                [-this.radiusTop, 0.0, this.height, 1],
                // V = 1
                [-this.radiusTop, (this.radiusTop/0.75), this.height, 1],
                // V = 2
                [this.radiusTop, (this.radiusTop/0.75), this.height, 1],
                // V = 3
                [this.radiusTop, 0.0, this.height, 1]
            ]
        ];
        // other half of cylinder
        this.controlVertexesLeft = 	[
            // U = 0
            [
                // V = 0
                [this.radiusBase, 0.0, 0.0, 1],
                // V = 1
                [this.radiusBase, -(this.radiusBase/0.75), 0.0, 1],
                // V = 2
                [-this.radiusBase, -(this.radiusBase/0.75), 0.0, 1],
                // V = 3
                [-this.radiusBase, 0.0, 0.0, 1]
            ],
            // U = 1
            [   
                // V = 0
                [this.radiusTop, 0.0, this.height, 1],
                // V = 1
                [this.radiusTop, -(this.radiusTop/0.75), this.height, 1],
                // V = 2
                [-this.radiusTop, -(this.radiusTop/0.75), this.height, 1],
                // V = 3
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
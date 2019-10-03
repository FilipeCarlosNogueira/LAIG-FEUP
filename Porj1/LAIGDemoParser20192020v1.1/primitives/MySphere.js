class MySphere extends CGFobject {

    constructor(scene, id, radius, slices, stacks){
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers(){

        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.textCoords = [];

        var theta = Math.PI/this.stacks;
        var phi = 2*Math.PI/this.slices;
        var r = this.radius;

        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                
                //spheric coords:
                //x= r*sin(theta)*cos(phi)
                //y= r*sin(theta)*sin(phi)
                //z= r*cos(theta)
                
                this.vertices.push( r * Math.sin(i * theta) * Math.cos(j * phi), 
                                    r * Math.sin(i * theta) * Math.sin(j * phi), 
                                    r * Math.cos(i * theta)
                );

                this.normals.push(  Math.sin(i * theta) * Math.cos(j * phi),
                                    Math.sin(i * theta) * Math.sin(j * phi),
                                    Math.cos(i * theta)
                );

                this.textCoords.push(j/this.slices, 1 - i/this.stacks);
            }
        }

        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {

                this.indices.push(  i * (this.slices + 1) + j,
                                    (i + 1) * (this.slices + 1) + j,
                                    (i + 1) * (this.slices + 1) + j + 1
                );

                this.indices.push(  i * (this.slices + 1) + j,
                                    (i + 1) * (this.slices + 1) + j + 1,
                                    i * (this.slices + 1) + j + 1
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	};
}
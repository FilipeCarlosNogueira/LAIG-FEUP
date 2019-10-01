class MyCylinder extends CGFobject {
    constructor(scene, id, slices, stacks, radiusTop, radiusBase, height) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radiusTop = radiusTop;
        this.radiusBase = radiusBase;
        this.height = height;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        for(var i=0; i<this.stacks; i++){
            for(var j = 0; j <= this.slices; j++){
                if(i == 0) 
                    this.vertices.push(Math.cos(ang)*this.radiusBase, (this.height/this.stacks)*i, -Math.sin(ang)*this.radiusBase);

                this.vertices.push(Math.cos(ang)*this.radiusTop, (this.height/this.stacks)*(i+1), -Math.sin(ang)*this.radiusTop);
                
                //
                this.indices.push((j*2+i*this.slices)%(this.slices*2), (j*2+2+i*this.slices)%(this.slices*2), (j*2+1+i*this.slices)%(this.slices*2));
                this.indices.push((j*2+2+i*this.slices)%(this.slices*2), (j*2+3+i*this.slices)%(this.slices*2), (j*2+1+i*this.slices)%(this.slices*2));
                //

                this.normals.push(Math.cos(ang)*this.radiusBase, 0, -Math.sin(ang)*this.radiusBase);
                this.normals.push(Math.cos(ang)*this.radiusTop, 0, -Math.sin(ang)*this.radiusTop);
                this.texCoords.push(i/this.slices,1);
                this.texCoords.push(i/this.slices,0);
                ang+=alphaAng;
                
            }
        }

         /*
        for(var j = 0; j < this.stacks; j++){
            for(var i = 0; i <= this.slices; i++){

                this.vertices.push(Math.cos(ang)*this.radiusBase, (this.height/this.stacks)*j, -Math.sin(ang)*this.radiusBase);
                this.vertices.push(Math.cos(ang)*this.radiusTop, (this.height/this.stacks)*(j+1), -Math.sin(ang)*this.radiusTop);
                if(i<this.slices){
                    this.indices.push( 2*i, 2*i+2 , 2*i+3 );
                    this.indices.push( 2*i+1, 2*i , 2*i+3 ); 
                }
                this.normals.push(Math.cos(ang)*this.radiusBase, 0, -Math.sin(ang)*this.radiusBase);
                this.normals.push(Math.cos(ang)*this.radiusTop, 0, -Math.sin(ang)*this.radiusTop);
                this.texCoords.push(i/this.slices,1);
                this.texCoords.push(i/this.slices,0);
                ang+=alphaAng;
            }
            j++;
        }
        */
        //this.vertices.push(0,1,0);
        //this.normals.push(0,1,0);


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}



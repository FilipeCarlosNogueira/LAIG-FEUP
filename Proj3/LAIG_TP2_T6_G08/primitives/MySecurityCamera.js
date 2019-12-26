class MySecurityCamera extends CGFobject{

    constructor(scene){
        super(scene);
        this.rectangle = new MyRectangle(this.scene, 0, 0.5, 1, -1, -0.5);
        this.shader = new CGFshader(this.scene.gl, "shaders/securityCam.vert", "shaders/securityCam.frag");
        this.shader.setUniformsValues({ uSampler: 1})

        this.rectangle.texCoords = [
            0,0,
            1,0,
            0,1,
            1,1
        ];
        this.rectangle.initGLBuffers();
    }

    update(time){
        this.shader.setUniformsValues({ timeFactor: time });
    }

    display(){
        this.scene.setActiveShader(this.shader);
        this.scene.textureRTT.bind(0);
        this.rectangle.display();
        this.scene.textureRTT.unbind(0);
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}

/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera{
    
    constructor(scene){
        this.scene = scene;
        this.rectangle = new MyRectangle(this.scene, 0, 0.5, 1, -1, -0.5);
        this.shader = new CGFshader(this.scene.gl, "shaders/securityCam.vert", "shaders/securityCam.frag");
    }

    update(time){
        //var factor = (Math.sin((time * 3.0) % 3141 * 0.002)+1.0)*.5;
        this.shader.setUniformsValues({ timeFactor: time });
    }

    display(){
        this.scene.setActiveShader(this.shader);
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
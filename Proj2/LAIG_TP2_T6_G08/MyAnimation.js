class MyAnimation{
    constructor(scene){
        this.scene = scene;
        this.matrix = mat4.create();
    }

    update(t){
        mat4.identity(this.matrix);
    }

    apply(){
        this.scene.multMatrix(this.matrix);
    }
}
class MyAnimation{
    constructor(scene){
        this.scene = scene;
        this.finished = 0;
        this.matrix = mat4.create();
    }
    update(t){
        if(this.finished) return;
        mat4.identity(this.matrix);
    }
    apply(){
        this.scene.multMatrix(this.matrix);
    }
}
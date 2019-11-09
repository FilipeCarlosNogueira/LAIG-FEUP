class Animation{
    constructor(scene){
        this.scene = scene;
        this.matrix = mat4.create();
    }

    update(t){
    }

    apply(){
        this.scene.multMatrix(this.matrix);
    }
}

class KeyframeAnimation extends Animation{
    constructor(scene, keyframes){
        super(scene);
        this.keyframes = keyframes;
        this.current_frame = 0;
    }

    update(t_ms){
        let t = t_ms/1000;
        let i = this.current_frame;
        for(i = this.current_frame; i < this.keyframes.length; i++) if(t <= this.keyframes[i].time) break;
        this.current_frame = i;

        let prev_frame = this.keyframes[i-1];
        let curr_frame = this.keyframes[i];
        let fraction_c = (t-prev_frame.time)/(curr_frame.time-prev_frame.time);
        let fraction_p = 1 - fraction_c;

        mat4.identity(this.matrix);

        // scale
        let scale = [];
        scale[0] = fraction_p * prev_frame.scale[0] + fraction_c * curr_frame.scale[0];
        scale[1] = fraction_p * prev_frame.scale[1] + fraction_c * curr_frame.scale[1];
        scale[2] = fraction_p * prev_frame.scale[2] + fraction_c * curr_frame.scale[2];
        mat4.scale(this.matrix, this.matrix, scale);

        // rotate
        let rotate = [];
        rotate[0] = fraction_p * prev_frame.rotate[0] + fraction_c * curr_frame.rotate[0];
        rotate[1] = fraction_p * prev_frame.rotate[1] + fraction_c * curr_frame.rotate[1];
        rotate[2] = fraction_p * prev_frame.rotate[2] + fraction_c * curr_frame.rotate[2];
        mat4.rotate(this.matrix, this.matrix, rotate[0], [1,0,0]);
        mat4.rotate(this.matrix, this.matrix, rotate[1], [0,1,0]);
        mat4.rotate(this.matrix, this.matrix, rotate[2], [0,0,1]);

        // translate
        let translate = [];
        translate[0] = fraction_p * prev_frame.translate[0] + fraction_c * curr_frame.translate[0];
        translate[1] = fraction_p * prev_frame.translate[1] + fraction_c * curr_frame.translate[1];
        translate[2] = fraction_p * prev_frame.translate[2] + fraction_c * curr_frame.translate[2];
        mat4.translate(this.matrix, this.matrix, translate);

    }
}
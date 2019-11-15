class MyKeyframeAnimation extends MyAnimation{
    constructor(scene, keyframes){
        super(scene);
        this.keyframes = keyframes;
        this.current_frame = 0;
    }

    update(t_ms){
        if(this.finished) return;

        // get previous and next frame to interpolate position
        let i;
        let t = t_ms/1000;
        for(i = this.current_frame; i < this.keyframes.length; i++) if(t <= this.keyframes[i][0]) break;
        this.current_frame = i;

        let prev_frame = this.keyframes[i-1], curr_frame = this.keyframes[i];

        if(prev_frame == undefined || curr_frame == undefined){
            this.finished = 1;
            return;
        }
        super.update(t_ms);

        let fraction_c = (t-prev_frame[0])/(curr_frame[0]-prev_frame[0]),
            fraction_p = 1 - fraction_c;

        // scale
        let scale = [];
        scale[0] = fraction_p * prev_frame[3][0] + fraction_c * curr_frame[3][0];
        scale[1] = fraction_p * prev_frame[3][1] + fraction_c * curr_frame[3][1];
        scale[2] = fraction_p * prev_frame[3][2] + fraction_c * curr_frame[3][2];
        mat4.scale(this.matrix, this.matrix, scale);

        // rotate
        let rotate = [];
        rotate[0] = fraction_p * prev_frame[2][0] + fraction_c * curr_frame[2][0];
        rotate[1] = fraction_p * prev_frame[2][1] + fraction_c * curr_frame[2][1];
        rotate[2] = fraction_p * prev_frame[2][2] + fraction_c * curr_frame[2][2];
        mat4.rotate(this.matrix, this.matrix, rotate[2], [0,0,1]);
        mat4.rotate(this.matrix, this.matrix, rotate[1], [0,1,0]);
        mat4.rotate(this.matrix, this.matrix, rotate[0], [1,0,0]);

        // translate
        let translate = [];
        translate[0] = fraction_p * prev_frame[1][0] + fraction_c * curr_frame[1][0];
        translate[1] = fraction_p * prev_frame[1][1] + fraction_c * curr_frame[1][1];
        translate[2] = fraction_p * prev_frame[1][2] + fraction_c * curr_frame[1][2];
        mat4.translate(this.matrix, this.matrix, translate);
    }
}
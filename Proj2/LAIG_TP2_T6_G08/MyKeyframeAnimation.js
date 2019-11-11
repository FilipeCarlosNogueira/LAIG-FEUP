class MyKeyframeAnimation extends MyAnimation{
    constructor(scene, keyframes){
        super(scene);
        this.keyframes = keyframes;
        this.current_frame = 0;
    }

    update(t_ms){
        super.update(t_ms);

        // get previous and next frame to interpolate position
        let t = t_ms/1000000000000;
        let i;
        for(i = this.current_frame; i < this.keyframes.length; i++) if(t <= this.keyframes[i].time) break;
        this.current_frame = i;

        let prev_frame = this.keyframes[i-2], curr_frame = this.keyframes[i-1],
            fraction_c = (t-prev_frame.time)/(curr_frame.time-prev_frame.time),
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
var DEGREE_TO_RAD = Math.PI / 180;
class XMLscene extends CGFscene {
    constructor(myinterface) {
        super();
        this.lightValues = [];
        this.interface = myinterface;
    }
    init(application) {
        super.init(application);
        this.sceneInited = false;
        this.initCameras();
        this.enableTextures(true);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
        this.textureRTT = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.last_update = Date.now();
        this.axis = new CGFaxis(this);

        this.gameController = new MyGameController(this);
    }
    initCameras() {
        this.cameraView = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));
    }
    initLights() {
        let i = 0;
        for (let key in this.graph.lights) {
            if (i >= 8)
                break;
            if (this.graph.lights.hasOwnProperty(key)) {
                let light = this.graph.lights[key];
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);
                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }
                this.lights[i].setVisible(true);
                if (light[0]){
                    this.lights[i].enable();}
                else
                    this.lights[i].disable();
                this.lights[i].update();
                this.lights[i]["name"] = light[light.length-1];
                this.lightValues[key] = this.lights[i].enabled;
                i++;
            }
        }
        this.interface.addLightsGroup(this.lightValues);
    }
    initViews(){
        this.view = 0;
        this.cameraView = this.graph.views[this.graph.default].camera;
        this.interface.addViewsGroup();
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        this.initLights();
        this.initViews();
        this.sceneInited = true;
        this.interface.setActiveCamera(this.cameraView);
    }
    render(Camera) {
        this.camera = Camera;
        this.checkKeys();
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.updateProjectionMatrix();
        this.loadIdentity();
        this.applyViewMatrix();
        this.pushMatrix();
        let i = 0;
        for (let key in this.graph.lights) {
            if (this.graph.lights.hasOwnProperty(key)) {
                if (this.lightValues[key]) this.lights[i].enable();
                else this.lights[i].disable();
                this.lights[i].update();
            }
            ++i;
        }
        if (this.sceneInited) {
            this.setDefaultAppearance();
            this.graph.displayScene();
            this.gameController.display();
            this.axis.display();
        }
        this.popMatrix();
    }
    checkKeys() {
        /* WIP maybe add key to change theme */
    }
    update(t){
        let delta_time = t - this.last_update;
        this.last_update = t;
        this.graph.update(delta_time);
        this.gameController.update(delta_time);
    }
    updateCamera(){
        this.cameraView = this.graph.views[this.view].camera;
        this.interface.setActiveCamera(this.cameraView);
    }
    display(){
        this.gameController.managePick(false, this.pickResults);
        this.clearPickRegistration();

        this.render(this.cameraView);
    }
}

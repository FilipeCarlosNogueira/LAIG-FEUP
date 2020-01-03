let DEGREE_TO_RAD = Math.PI / 180;
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
        this.setUpdatePeriod(20);
        this.textureRTT = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.last_update = Date.now();
        this.axis = new CGFaxis(this);
        this.initGame();
    }
    initCameras() {
        this.cameraView = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));
    }
    initGame() {
        this.gameController = new MyGameController(this);
        //this.theme = 0;
        //this.themeSelect = this.gameController.themes;
        //this.interface.addThemeGroup();
    }
    initLights() {
        let i = 0;
        for (let key in this.gameController.currentTheme.lights) {
            if (i >= 8)
                break;
            if (this.gameController.currentTheme.lights.hasOwnProperty(key)) {
                let light = this.gameController.currentTheme.lights[key];
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
        this.cameraView = this.gameController.currentTheme.views[this.gameController.currentTheme.default].camera;
        this.interface.addViewsGroup();
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.gameController.currentTheme.referenceLength);
        this.gl.clearColor(this.gameController.currentTheme.background[0], this.gameController.currentTheme.background[1], this.gameController.currentTheme.background[2], this.gameController.currentTheme.background[3]);
        this.setGlobalAmbientLight(this.gameController.currentTheme.ambient[0], this.gameController.currentTheme.ambient[1], this.gameController.currentTheme.ambient[2], this.gameController.currentTheme.ambient[3]);
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
        for (let key in this.gameController.currentTheme.lights) {
            if (this.gameController.currentTheme.lights.hasOwnProperty(key)) {
                if (this.lightValues[key]) this.lights[i].enable();
                else this.lights[i].disable();
                this.lights[i].update();
            }
            ++i;
        }
        if (this.sceneInited) {
            this.setDefaultAppearance();
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
        this.gameController.currentTheme.update(delta_time);
        this.gameController.update(delta_time);
        if(this.n_portions) {
            this.camera.orbit(CGFcameraAxis.Y, this.portion);
            this.n_portions--;
        }
    }
    updateCamera(){
        this.cameraView = this.gameController.currentTheme.views[this.view].camera;
        this.interface.setActiveCamera(this.cameraView);
    }
    updateTheme(){
        this.gameController.changeTheme(this.theme);
    }
    display(){
        this.gameController.managePick(false, this.pickResults);
        this.clearPickRegistration();

        this.render(this.cameraView);
    }
    rotateCam(angle){
        this.portion = angle/50;
        this.n_portions = 50;
    }
}

class MyInterface extends CGFinterface {
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.gui = new dat.GUI();
        this.initKeys();
        return true;
    }
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }
    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };
    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
    addLightsGroup(lights){
        this.groupLights = this.gui.addFolder('Lights');
        this.groupLights.open();
        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                if (lights[key])
                    this.scene.lightValues[key] = true;
                else
                    this.scene.lightValues[key] = false;
                this.groupLights.add(this.scene.lightValues, key).name(key);
            }
        }
    }
    addViewsGroup() {
        this.gui.add(this.scene, 'view', this.scene.viewsSelect).onChange(this.scene.updateCamera.bind(this.scene)).name('Camera');
        this.gui.add(this.scene, 'security', this.scene.securitySelect).onChange(this.scene.updateSecurity.bind(this.scene)).name('Security');
    }
}

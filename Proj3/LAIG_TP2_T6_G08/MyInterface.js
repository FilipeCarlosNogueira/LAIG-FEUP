class MyInterface extends CGFinterface {
    constructor() {
        super();
        this.mouse_enabled = false;
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
    }
    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    }
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
    addLightsGroup(lights){
        this.groupLights = this.gui.addFolder('Lights');
        this.groupLights.open();
        for (let key in lights) {
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
    }
    addThemeGroup() {
        this.gui.add(this.scene, 'theme', this.scene.themeSelect).onChange(this.scene.updateTheme.bind(this.scene)).name('Theme');
    }
    addThemeGroup() {
        this.gui.add(this.scene, 'theme', this.scene.themeSelect).onChange(this.scene.updateTheme.bind(this.scene)).name('Theme');
    }
    addUndoButton() {
        this.gui.add(this.scene, 'undo').name('🕹 Undo');
    }
    addResetButton() {
        this.gui.add(this.scene, 'reset').name('🕹 Reset');
    }
    addMovieButton() {
        this.gui.add(this.scene, 'movie').name('🕹 Movie');
    }
}

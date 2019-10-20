/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        
        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
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

    // Lights Group
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
    
    // Views Group
    addViewsGroup(viewValues) {
        var viewNames = [];

        for (var key in viewValues){
            viewNames.push(key);
        }

        this.gui.add(this.scene, 'currentView', viewNames).name("Views");
    }
}
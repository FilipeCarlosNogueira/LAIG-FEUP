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

    // Views Group
    addViewsGroup(views) {
        var Names = [];

        for (var v in views)
            Names.push(v);


        this.gui.add(this.scene, 'Views', Names);
    }

    /*
    addLightsGroup(lights){

        var groupLights = gui.addFolder('Lights');
        groupLights.open();
        
        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                if (lights[key].enabled == 0)
                    this.scene.[key] = false;
                
                if (lights[key].enabled == 1)
                    this.scene.lightValues[key] = true;
                
                groupLights.add(this.scene.lightValues, key);
            }
        }
    }
    */
}
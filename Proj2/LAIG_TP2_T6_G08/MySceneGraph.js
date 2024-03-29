var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
  /**
   * @constructor
   */
  constructor(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null;  // The id of the root element.
    this.matID = 0;

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading
     * and error handlers. After the file is read, the reader calls onXMLReady
     * on this object. If any error occurs, the reader calls onXMLError on this
     * object, with an error message
     */
    this.reader.open('scenes/' + filename, this);
  }

  /*
   * Callback to be executed after successful reading
   */
  onXMLReady() {
    this.log('XML Loading finished.');
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various
    // blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional
    // initialization depending on the graph can take place
    this.scene.onGraphLoaded();
  }

  /**
   * Parses the XML file, processing each block.
   * @param {XML root element} rootElement
   */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != 'lxs') return 'root tag <lxs> missing';

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <scene>
    var index;
    if ((index = nodeNames.indexOf('scene')) == -1)
      return 'tag <scene> missing';
    else {
      if (index != SCENE_INDEX)
        this.onXMLMinorError('tag <scene> out of order ' + index);

      // Parse scene block
      if ((error = this.parseScene(nodes[index])) != null) return error;
    }

    // <views>
    if ((index = nodeNames.indexOf('views')) == -1)
      return 'tag <views> missing';
    else {
      if (index != VIEWS_INDEX)
        this.onXMLMinorError('tag <views> out of order');

      // Parse views block
      if ((error = this.parseView(nodes[index])) != null) return error;
    }

    // <ambient>
    if ((index = nodeNames.indexOf('globals')) == -1)
      return 'tag <globals> missing';
    else {
      if (index != AMBIENT_INDEX)
        this.onXMLMinorError('tag <ambient> out of order');

      // Parse ambient block
      if ((error = this.parseAmbient(nodes[index])) != null) return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf('lights')) == -1)
      return 'tag <lights> missing';
    else {
      if (index != LIGHTS_INDEX)
        this.onXMLMinorError('tag <lights> out of order');

      // Parse lights block
      if ((error = this.parseLights(nodes[index])) != null) return error;
    }
    // <textures>
    if ((index = nodeNames.indexOf('textures')) == -1)
      return 'tag <textures> missing';
    else {
      if (index != TEXTURES_INDEX)
        this.onXMLMinorError('tag <textures> out of order');

      // Parse textures block
      if ((error = this.parseTextures(nodes[index])) != null) return error;
    }

    // <materials>
    if ((index = nodeNames.indexOf('materials')) == -1)
      return 'tag <materials> missing';
    else {
      if (index != MATERIALS_INDEX)
        this.onXMLMinorError('tag <materials> out of order');

      // Parse materials block
      if ((error = this.parseMaterials(nodes[index])) != null) return error;
    }

    // <transformations>
    if ((index = nodeNames.indexOf('transformations')) == -1)
      return 'tag <transformations> missing';
    else {
      if (index != TRANSFORMATIONS_INDEX)
        this.onXMLMinorError('tag <transformations> out of order');

      // Parse transformations block
      if ((error = this.parseTransformations(nodes[index])) != null)
        return error;
    }

    // <animations>
    if ((index = nodeNames.indexOf('animations')) == -1)
      return 'tag <animations> missing';
    else {
      if (index != ANIMATIONS_INDEX)
        this.onXMLMinorError('tag <animations> out of order');

      // Parse transformations block
      if ((error = this.parseAnimations(nodes[index])) != null)
        return error;
    }

    // <primitives>
    if ((index = nodeNames.indexOf('primitives')) == -1)
      return 'tag <primitives> missing';
    else {
      if (index != PRIMITIVES_INDEX)
        this.onXMLMinorError('tag <primitives> out of order');

      // Parse primitives block
      if ((error = this.parsePrimitives(nodes[index])) != null) return error;
    }

    // <components>
    if ((index = nodeNames.indexOf('components')) == -1)
      return 'tag <components> missing';
    else {
      if (index != COMPONENTS_INDEX)
        this.onXMLMinorError('tag <components> out of order');

      // Parse components block
      if ((error = this.parseComponents(nodes[index])) != null) return error;
    }
    this.log('all parsed');
  }

  /**
   * Parses the <scene> block.
   * @param {scene block element} sceneNode
   */
  parseScene(sceneNode) {
    // Get root of the scene.
    var root = this.reader.getString(sceneNode, 'root');
    if (root == null) return 'no root defined for scene';

    this.idRoot = root;

    // Get axis length
    var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
    if (axis_length == null)
      this.onXMLMinorError(
        'no axis_length defined for scene; assuming \'length = 1\'');

    this.referenceLength = axis_length || 1;

    this.log('Parsed scene');

    return null;
  }

  /**
   * Parses the <views> block.
   * @param {view block element} viewsNode
   */
  parseView(viewsNode) {
    // Views Array
    this.views = [];
    this.scene.viewsSelect = [];
    this.scene.securitySelect = [];

    //check if defaultCamera is defined
    this.default = this.reader.getString(viewsNode, 'default');
    if (this.default == null) {
      this.onXMLError("Default view not defined!");
    }

    var childrenView = viewsNode.children;

    // Check if there's at least one view defined. If not, creats one.
    if (childrenView.length == 0) {
      this.onXMLMinorError("At least one view must be defined. Assuming default view! id = " + this.default);

      // Parse view
      this.views[id] = {};
      this.views[id].id = 'default';
      this.views[id].type = 'perspective';
      this.views[id].near = 0.1;
      this.views[id].far = 500;
      this.views[id].angle = 45 * DEGREE_TO_RAD;
      this.views[id].fromX = 150;
      this.views[id].fromY = 50;
      this.views[id].fromZ = 150;
      this.views[id].toX = 0;
      this.views[id].toY = 20;
      this.views[id].toZ = 0;

      this.log('Parsed Views');
      return null;
    }

    // Any number of views.
    var nodeName;
    for (var i = 0; i < childrenView.length; i++) {
      nodeName = childrenView[i].nodeName;

      // Perspective view
      if (nodeName == 'perspective') {

        // Parse and Verification:

        // ID
        var id = this.reader.getString(childrenView[i], 'id');
        if (id == null) return 'ERROR! Perspective ID is null!';

        // near
        var near = this.reader.getFloat(childrenView[i], 'near');
        if (near == null) return 'ERROR! Perspective near is null!';

        // far
        var far = this.reader.getFloat(childrenView[i], 'far');
        if (far == null) return 'ERROR! Perspective far is null';

        if (far <= near) return 'ERROR! far must be bigger than near!';

        // angle
        var angle = this.reader.getFloat(childrenView[i], 'angle');
        if (angle == null) return 'ERROR! Perspective angle is null';
        if (angle < 0 || angle > 90) return 'ERROR! Angle must be between 0 and 90!';

        // from
        var from = childrenView[i].getElementsByTagName('from');
        if (from == null) return 'ERROR! from value must be defined!';
        if (from.length > 1) return 'ERROR! Ther must only be one \'from\' value!';

        var fromX = this.reader.getFloat(from[0], 'x');
        if (fromX == null) return 'ERROR! fromX undefined!';

        var fromY = this.reader.getFloat(from[0], 'y');
        if (fromY == null) return 'ERROR! fromY undefined!';

        var fromZ = this.reader.getFloat(from[0], 'z');
        if (fromZ == null) return 'ERROR! fromZ undefined!';

        // to
        var to = childrenView[i].getElementsByTagName('to');
        if (to == null) return 'ERROR! to value must be defined!';
        if (to.length > 1) return 'ERROR! There must only be one \'to\' value';

        var toX = this.reader.getFloat(to[0], 'x');
        if (toX == null) return 'ERROR! toX undefined!';

        var toY = this.reader.getFloat(to[0], 'y');
        if (toY == null) return 'ERROR! toY undefined!';

        var toZ = this.reader.getFloat(to[0], 'z');
        if (toZ == null) return 'ERROR! toZ undefined!';

        // From and To Value verification
        if (fromX == toX && fromY == toY && fromZ == toZ) return 'ERROR! \'from\' and \'to\' must have different values!';

        // Check if view already exists
        if (this.views[id] != null) return 'ERROR! View ID already exists! Change ID and reload!';

        //Parse view
        this.views[id] = {};
        this.views[id].type = 'perspective';

        // Create Camera
        this.views[id].camera = new CGFcamera(angle * DEGREE_TO_RAD, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
      }

      // Ortho view
      else if (nodeName == 'ortho') {

        // Parse and Verification:

        // ID
        var id = this.reader.getString(childrenView[i], 'id');
        if (id == null) return 'ERROR! Ortho ID is null!';

        // near
        var near = this.reader.getFloat(childrenView[i], 'near');
        if (near == null) return 'ERROR! Perspective near is null!';

        // far
        var far = this.reader.getFloat(childrenView[i], 'far');
        if (far == null) return 'ERROR! Perspective far is null';

        if (far <= near) return 'ERROR! far must be bigger than near!';

        // left
        var left = this.reader.getFloat(childrenView[i], 'left');
        if (left == null) return 'ERROR! left is not defined!';

        // right
        var right = this.reader.getFloat(childrenView[i], 'right');
        if (right == null) return 'ERROR! right is not defined!';

        if (left == right) return 'ERROR! left and rigth must be different!';

        // top
        var top = this.reader.getFloat(childrenView[i], 'top');
        if (top == null) return 'ERROR! top is not defined!';

        // bottom
        var bottom = this.reader.getFloat(childrenView[i], 'bottom');
        if (bottom == null) return 'ERROR! bottom is not defined!';

        if (top == bottom) return 'ERROR! top and bottom must be different!';

        // from
        var from = childrenView[i].getElementsByTagName('from');
        if (from == null) return 'ERROR! from value must be defined!';
        if (from.length > 1) return 'ERROR! Ther must only be one \'from\' value!';

        var fromX = this.reader.getFloat(from[0], 'x');
        if (fromX == null) return 'ERROR! fromX undefined!';

        var fromY = this.reader.getFloat(from[0], 'y');
        if (fromY == null) return 'ERROR! fromY undefined!';

        var fromZ = this.reader.getFloat(from[0], 'z');
        if (fromZ == null) return 'ERROR! fromZ undefined!';

        // to
        var to = childrenView[i].getElementsByTagName('to');
        if (to == null) return 'ERROR! to value must be defined!';
        if (to.length > 1) return 'ERROR! There must only be one \'to\' value';

        var toX = this.reader.getFloat(to[0], 'x');
        if (toX == null) return 'ERROR! toX undefined!';

        var toY = this.reader.getFloat(to[0], 'y');
        if (toY == null) return 'ERROR! toY undefined!';

        var toZ = this.reader.getFloat(to[0], 'z');
        if (toZ == null) return 'ERROR! toZ undefined!';

        // From and To Value verification
        if (fromX == toX && fromY == toY && fromZ == toZ) return 'ERROR! \'from\' and \'to\' must have different values!';

        // up
        var up = childrenView[i].getElementsByTagName('up');
        var upX, upY, upZ;
        if (up.length == 0){ // Create default value
          upX = 0;
          upY = 1;
          upZ = 0;
        } else if(up.length == 1){

          upX = this.reader.getFloat(up[0], 'x');
          if (upX == null) return 'ERROR! upX undefined!';

          upY = this.reader.getFloat(up[0], 'y');
          if (upY == null) return 'ERROR! upY undefined!';

          upZ = this.reader.getFloat(up[0], 'z');
          if (upZ == null) return 'ERROR! upZ undefined!';
        } else if (up.length > 1) return 'ERROR! There must only be one \'up\' value';

        // Check if view already exists
        if (this.views[id] != null) return 'ERROR! View ID already exists! Change ID and reload!';

        //Parse view
        this.views[id] = {};
        this.views[id].type = 'ortho';

        // Create Camera
        this.views[id].camera = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ), vec3.fromValues(upX, upY, upZ));
      }
      this.scene.viewsSelect[i] = id;
      this.scene.securitySelect[i] = id;
    }

    this.log('Parsed Views');

    return null;
  }

  /**
   * Parses the <ambient> node.
   * @param {ambient block element} ambientsNode
   */
  parseAmbient(ambientsNode) {
    var children = ambientsNode.children;

    this.ambient = [];
    this.background = [];

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    var ambientIndex = nodeNames.indexOf('ambient');
    var backgroundIndex = nodeNames.indexOf('background');

    var color = this.parseColor(children[ambientIndex], 'ambient');
    if (!Array.isArray(color))
      return color;
    else
      this.ambient = color;

    color = this.parseColor(children[backgroundIndex], 'background');
    if (!Array.isArray(color))
      return color;
    else
      this.background = color;

    this.log('Parsed globals');

    return null;
  }

  /**
   * Parses the <light> node.
   * @param {lights block element} lightsNode
   */
  parseLights(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {
      // Storing light information
      var global = [];
      var attributeNames = [];
      var attributeTypes = [];

      // Check type of light
      if (children[i].nodeName != 'omni' && children[i].nodeName != 'spot') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      } else {
        attributeNames.push(...['location', 'ambient', 'diffuse', 'specular', 'attenuation']);
        attributeTypes.push(...['location', 'color', 'color', 'color', 'attenuation']);
      }

      // Get id of the current light.
      var lightId = this.reader.getString(children[i], 'id');
      if (lightId == null) return 'no ID defined for light';
      // Checks for repeated IDs.
      if (this.lights[lightId] != null)
        return ('ID must be unique for each light (conflict: ID = ' + lightId + ')');

      // Light enable/disable
      var enableLight = true;
      var aux = this.reader.getBoolean(children[i], 'enabled');
      if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
        this.onXMLMinorError(
          'unable to parse value component of the \'enable light\' field for ID = ' +
          lightId + '; assuming \'value = 1\'');

      enableLight = aux;

      // Add enabled boolean and type name to light info
      global.push(enableLight);
      global.push(children[i].nodeName);

      grandChildren = children[i].children;
      // Specifications for the current light.

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      for (var j = 0; j < attributeNames.length; j++) {
        var attributeIndex = nodeNames.indexOf(attributeNames[j]);

        if (attributeIndex != -1) {
          if (attributeTypes[j] == 'location')
            var aux = this.parseCoordinates4D(grandChildren[attributeIndex], 'light position for ID' + lightId);

          else if (attributeTypes[j] == 'attenuation') {

            // constant
            var constant = this.reader.getFloat(grandChildren[attributeIndex], 'constant');
            if (!(constant != null && !isNaN(constant)))
              return 'unable to parse constant-coordinate of the ' + 'light attenuation for ID' + lightId;

            // linear
            var linear = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
            if (!(linear != null && !isNaN(linear)))
              return 'unable to parse linear-coordinate of the ' + 'light attenuation for ID' + lightId;

            // quadratic
            var quadratic = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
            if (!(quadratic != null && !isNaN(quadratic)))
              return 'unable to parse quadratic-coordinate of the ' + 'light attenuation for ID' + lightId;

            // Values Verification
            if (constant + linear + quadratic != 1)
              return 'ERROR! Light attenuation values invalid!';

            var aux = [];
            aux.push(...[constant, linear, quadratic]);
          }

          else if (attributeTypes[j] == 'color')
            var aux = this.parseColor(
              grandChildren[attributeIndex],
              attributeNames[j] + ' illumination for ID' + lightId);

          if (!Array.isArray(aux)) return aux;

          global.push(aux);
        } else
          this.onXMLError('light ' + attributeNames[i] + ' undefined for ID = ' + lightId);
      }

      // Gets the additional attributes of the spot light
      if (children[i].nodeName == 'spot') {
        var angle = this.reader.getFloat(children[i], 'angle');
        if (!(angle != null && !isNaN(angle)))
          return 'unable to parse angle of the light for ID = ' + lightId;

        var exponent = this.reader.getFloat(children[i], 'exponent');
        if (!(exponent != null && !isNaN(exponent)))
          return 'unable to parse exponent of the light for ID = ' + lightId;

        var targetIndex = nodeNames.indexOf('target');

        // Retrieves the light target.
        var targetLight = [];
        if (targetIndex != -1) {
          var aux = this.parseCoordinates3D(
            grandChildren[targetIndex], 'target light for ID ' + lightId);
          if (!Array.isArray(aux)) return aux;

          targetLight = aux;
        } else
          return 'light target undefined for ID = ' + lightId;

        global.push(...[angle, exponent, targetLight]);
      }

      // Parse ID
      global.push(lightId);

      this.lights[lightId] = global;
      numLights++;
    }

    if (numLights == 0)
      return 'at least one light must be defined';
    else if (numLights > 8)
      this.onXMLMinorError(
        'too many lights defined; WebGL imposes a limit of 8 lights');

    this.log('Parsed lights');
    return null;
  }

  /**
   * Parses the <textures> block.
   * @param {textures block element} texturesNode
   */
  parseTextures(texturesNode) {
    let children = texturesNode.children;
    this.textures = [];

    // Read textures
    for (let i = 0; i < children.length; i++) {

      // Check nodeName
      if (children[i].nodeName != 'texture') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Check ID
      let textID = this.reader.getString(children[i], 'id');
      if (textID == null) continue;

      // Checks for repeated IDs.
      if (this.textures[textID] != null) {
        this.onXMLMinorError('Repeated texture ID will be ignored (' + textID + ')');
        continue;
      }

      // Check URL
      let file = this.reader.getString(children[i], 'file');
      if (file == null) {
        this.onXMLMinorError('Error on texture file in (' + textID + ')');
        continue;
      }

      this.textures[textID] = new CGFtexture(this.scene, file);
    }

    this.log('Parsed textures');
    return;
  }

  /**
   * Parses the <materials> node.
   * @param {materials block element} materialsNode
   */
  parseMaterials(materialsNode) {
    var children = materialsNode.children;

    this.materials = [];

    var grandChildren = [];
    var nodeNames = [];

    // Any number of materials.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'material') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current material.
      var materialID = this.reader.getString(children[i], 'id');
      if (materialID == null) return 'no ID defined for material';

      // Checks for repeated IDs.
      if (this.materials[materialID] != null)
        return ('ID must be unique for each light (conflict: ID = ' + materialID + ')');

      // Continue here
      //this.onXMLMinorError('To do: Parse materials.');

      // Get shininess of the current material
      var shininess = this.reader.getFloat(children[i], 'shininess');
      if (shininess == null) return 'no shininess defined for material';

      grandChildren = children[i].children;

      // Gets id of each element.
      if (grandChildren.length != 4)
        return 'number of material properties wrong! Length:' + grandChildren.length + '. Should be 4!';

      var emissionIndex = 0;
      var ambientIndex = 1;
      var diffuseIndex = 2;
      var specularIndex = 3;

      nodeNames.push(grandChildren[emissionIndex].nodeName);
      var emissionID = nodeNames.indexOf("emission");

      nodeNames.push(grandChildren[ambientIndex].nodeName);
      var ambientID = nodeNames.indexOf("ambient");

      nodeNames.push(grandChildren[diffuseIndex].nodeName);
      var diffuseID = nodeNames.indexOf("diffuse");

      nodeNames.push(grandChildren[specularIndex].nodeName);
      var specularID = nodeNames.indexOf("specular");

      // Create new material
      var newMaterial = new CGFappearance(this.scene);
      newMaterial.setShininess(shininess);

      var r, g, b, a;

      // Checks if the IDs are valid! If not, returns error.

      //emission
      if (emissionID != -1) {

        r = this.reader.getFloat(grandChildren[emissionID], 'r');
        g = this.reader.getFloat(grandChildren[emissionID], 'g');
        b = this.reader.getFloat(grandChildren[emissionID], 'b');
        a = this.reader.getFloat(grandChildren[emissionID], 'a');

        if (r == null || g == null || b == null || a == null)
          return "RGBA values unvalid! Parsing emission from material failed!";

        newMaterial.setEmission(r, g, b, a);
      } else return 'failed to get id to emission!';

      //ambient
      if (ambientID != -1) {

        r = this.reader.getFloat(grandChildren[ambientID], 'r');
        g = this.reader.getFloat(grandChildren[ambientID], 'g');
        b = this.reader.getFloat(grandChildren[ambientID], 'b');
        a = this.reader.getFloat(grandChildren[ambientID], 'a');

        if (r == null || g == null || b == null || a == null)
          return "RGBA values unvalid! Parsing emission from material failed!";

        newMaterial.setAmbient(r, g, b, a);
      } else return 'failed to get id to ambient!';

      //diffuse
      if (diffuseID != -1) {

        r = this.reader.getFloat(grandChildren[diffuseID], 'r');
        g = this.reader.getFloat(grandChildren[diffuseID], 'g');
        b = this.reader.getFloat(grandChildren[diffuseID], 'b');
        a = this.reader.getFloat(grandChildren[diffuseID], 'a');

        if (r == null || g == null || b == null || a == null)
          return "RGBA values invalid! Parsing emission from material failed!";

        newMaterial.setDiffuse(r, g, b, a);
      } else return 'failed to get id to diffuse!';

      //specular
      if (specularID != -1) {

        r = this.reader.getFloat(grandChildren[specularID], 'r');
        g = this.reader.getFloat(grandChildren[specularID], 'g');
        b = this.reader.getFloat(grandChildren[specularID], 'b');
        a = this.reader.getFloat(grandChildren[specularID], 'a');

        if (r == null || g == null || b == null || a == null)
          return "RGBA values invalid! Parsing emission from material failed!";

        newMaterial.setSpecular(r, g, b, a);
      } else return 'failed to get id to specular!';

      newMaterial.setTextureWrap('REPEAT', 'REPEAT');

      this.materials[materialID] = newMaterial;
    }

    this.log("Parsed materials");
    return null;
  }

  /**
   * Parses the <transformations> block.
   * @param {transformations block element} transformationsNode
   */
  parseTransformations(transformationsNode) {
    var children = transformationsNode.children;

    this.transformations = [];

    var grandChildren = [];

    // Any number of transformations.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'transformation') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current transformation.
      var transformationID = this.reader.getString(children[i], 'id');
      if (transformationID == null) return 'no ID defined for transformation';

      // Checks for repeated IDs.
      if (this.transformations[transformationID] != null)
        return ('ID must be unique for each transformation (conflict: ID = ' + transformationID + ')');

      grandChildren = children[i].children;
      // Specifications for the current transformation.

      var transfMatrix = mat4.create();

      for (var j = 0; j < grandChildren.length; j++) {
        switch (grandChildren[j].nodeName) {
          case 'translate':
            var coordinates = this.parseCoordinates3D(grandChildren[j], 'translate transformation for ID ' + transformationID);
            if (!Array.isArray(coordinates)) return coordinates;

            transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
            break;

          case 'scale':
            // this.onXMLMinorError('To do: Parse scale transformations.');
            var coordinates = this.parseCoordinates3D(grandChildren[j], 'scale transformation for component for ID' + transformationID);
            if (!Array.isArray(coordinates)) return coordinates;

            mat4.scale(transfMatrix, transfMatrix, coordinates);
            break;

          case 'rotate':
            // this.onXMLMinorError('To do: Parse rotate transformations.');

            // axis
            var axis = this.reader.getString(grandChildren[j], 'axis');
            // angle
            var angle = this.reader.getFloat(grandChildren[j], 'angle');

            if (axis == null || angle == null) {
              return 'failed to parse \'rotate\' from component';
            }

            var axisAux = vec3.create();
            if (axis == 'x')
              axisAux = vec3.fromValues(1, 0, 0);

            else if (axis == 'y')
              axisAux = [0, 1, 0];
            else if (axis == 'z')
              axisAux = vec3.fromValues(0, 0, 1);
            else
              return 'Unvalid axis fot rotation';

            mat4.rotate(
              transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, axisAux);
            break;
        }
      }
      this.transformations[transformationID] = transfMatrix;
    }

    this.log('Parsed transformations');
    return null;
  }

  /**
   * Parses the <animations> block.
   * @param {animations block element} animationsNode
   */
  parseAnimations(animationsNode){
    this.animations = [];
    let animation, keyframes = [];

    // parse each animation
    let children = animationsNode.children;
    for(let i = 0; i < children.length; i++){

      if(children[i].nodeName != "animation"){
        this.onXMLMinorError("Error on animation number:" + i);
        continue;
      }

      // get animation id
      let anim_id = this.reader.getString(children[i], 'id');
      if(anim_id == null){
        this.onXMLMinorError("Error on animation number:" + i);
        continue;
      }
      if(this.animations[anim_id]!=null){
        this.onXMLMinorError("Duplicate animation id:" + anim_id);
        continue;
      }

      keyframes = [];
      keyframes.push([0,[0,0,0],[0,0,0],[1,1,1]]);

      // parse each keyframe
      let grandChildren = children[i].children;
      for(let j = 0; j < grandChildren.length; j++){
        let keyframe = [];

        // instant
        let instant = this.reader.getFloat(grandChildren[j], 'instant');
        if(instant == null){
          this.onXMLMinorError("Invalid instant on animation:" + anim_id);
          continue;
        }
        keyframe.push(instant);

        let grandgrandChildren = grandChildren[j].children;

        // translate
        if(grandgrandChildren[0].nodeName != "translate"){
          this.onXMLMinorError("Translate out of order on animation:" + anim_id);
          continue;
        }
        let translate = this.parseCoordinates3D(grandgrandChildren[0], 'translate transformation for animation ID ' + anim_id);
        keyframe.push(translate);

        // rotate
        if(grandgrandChildren[1].nodeName != "rotate"){
          this.onXMLMinorError("Rotate out of order on animation:" + anim_id);
          continue;
        }

        // x
        let x = this.reader.getFloat(grandgrandChildren[1], 'angle_x');
        if (!(x != null && !isNaN(x))){
          this.onXMLMinorError("Error on rotate of animation " + anim_id);
          continue;
        }

        // y
        let y = this.reader.getFloat(grandgrandChildren[1], 'angle_y');
        if (!(y != null && !isNaN(y))){
          this.onXMLMinorError("Error on rotate of animation " + anim_id);
          continue;
        }

        // z
        let z = this.reader.getFloat(grandgrandChildren[1], 'angle_z');
        if (!(z != null && !isNaN(z))){
          this.onXMLMinorError("Error on rotate of animation " + anim_id);
          continue;
        }

        keyframe.push([x*DEGREE_TO_RAD, y*DEGREE_TO_RAD, z*DEGREE_TO_RAD]);

        // scale
        if(grandgrandChildren[2].nodeName != "scale"){
          this.onXMLMinorError("Scale out of order on animation:" + anim_id);
          continue;
        }
        let scale = this.parseCoordinates3D(grandgrandChildren[2], 'translate transformation for animation ID ' + anim_id);
        keyframe.push(scale);

        keyframes.push(keyframe);
      }

      animation = new MyKeyframeAnimation(this.scene, keyframes);

      this.animations[anim_id] = animation;
    }

    this.log('Parsed animations');
    return null;
  }

  /**
   * Parses the <primitives> block.
   * @param {primitives block element} primitivesNode
   */
  parsePrimitives(primitivesNode) {
    var children = primitivesNode.children;

    this.primitives = [];

    var grandChildren = [];

    // Any number of primitives.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'primitive') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current primitive.
      var primitiveId = this.reader.getString(children[i], 'id');
      if (primitiveId == null) return 'no ID defined for texture';

      // Checks for repeated IDs.
      if (this.primitives[primitiveId] != null)
        return ('ID must be unique for each primitive (conflict: ID = ' + primitiveId + ')');

      grandChildren = children[i].children;

      // Validate the primitive type
      if (grandChildren.length != 1 ||
        (grandChildren[0].nodeName != 'rectangle' &&
          grandChildren[0].nodeName != 'triangle' &&
          grandChildren[0].nodeName != 'cylinder' &&
          grandChildren[0].nodeName != 'sphere' &&
          grandChildren[0].nodeName != 'torus' &&
          grandChildren[0].nodeName != 'plane' &&
          grandChildren[0].nodeName != 'patch' &&
          grandChildren[0].nodeName != 'cylinder2')) {
        return 'There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch or cylinder2)';
      }

      // Specifications for the current primitive.
      var primitiveType = grandChildren[0].nodeName;

      // Retrieves the primitive coordinates.
      if (primitiveType == 'rectangle') {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
          return (
            'unable to parse x1 of the primitive coordinates for ID = ' +
            primitiveId);

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
          return (
            'unable to parse y1 of the primitive coordinates for ID = ' +
            primitiveId);

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
          return (
            'unable to parse x2 of the primitive coordinates for ID = ' +
            primitiveId);

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
          return (
            'unable to parse y2 of the primitive coordinates for ID = ' +
            primitiveId);

        var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

        this.primitives[primitiveId] = rect;
      } else if (primitiveType == 'triangle') {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
          return (
            'unable to parse x1 of the primitive coordinates for ID = ' +
            primitiveId);

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
          return (
            'unable to parse y1 of the primitive coordinates for ID = ' +
            primitiveId);

        // z1
        var z1 = this.reader.getFloat(grandChildren[0], 'z1');
        if (!(z1 != null && !isNaN(z1)))
          return (
            'unable to parse z1 of the primitive coordinates for ID = ' +
            primitiveId);

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2)))
          return (
            'unable to parse x2 of the primitive coordinates for ID = ' +
            primitiveId);

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2)))
          return (
            'unable to parse y2 of the primitive coordinates for ID = ' +
            primitiveId);

        // z2
        var z2 = this.reader.getFloat(grandChildren[0], 'z2');
        if (!(z2 != null && !isNaN(z2)))
          return (
            'unable to parse z2 of the primitive coordinates for ID = ' +
            primitiveId);

        // x3
        var x3 = this.reader.getFloat(grandChildren[0], 'x3');
        if (!(x3 != null && !isNaN(x3)))
          return (
            'unable to parse x3 of the primitive coordinates for ID = ' +
            primitiveId);

        // y3
        var y3 = this.reader.getFloat(grandChildren[0], 'y3');
        if (!(y3 != null && !isNaN(y3)))
          return (
            'unable to parse y3 of the primitive coordinates for ID = ' +
            primitiveId);

        // z3
        var z3 = this.reader.getFloat(grandChildren[0], 'z3');
        if (!(z3 != null && !isNaN(z3)))
          return (
            'unable to parse z3 of the primitive coordinates for ID = ' +
            primitiveId);

        var rectTriangle = new MyTriangle(
          this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

        this.primitives[primitiveId] = rectTriangle;
      } else if (primitiveType == 'cylinder' || primitiveType == 'cylinder2') {
        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && slices >= 3))
          return (
            'unable to parse slices of the primitive coordinates for ID = ' +
            primitiveId);

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks > 0))
          return (
            'unable to parse stacks of the primitive coordinates for ID = ' +
            primitiveId);

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (!(top != null && !isNaN(top) && top >= 0))
          return (
            'unable to parse top of the primitive coordinates for ID = ' +
            primitiveId);

        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (!(base != null && !isNaN(base) && base >= 0))
          return (
            'unable to parse base of the primitive coordinates for ID = ' +
            primitiveId);

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (!(height != null && !isNaN(height) && height > 0))
          return (
            'unable to parse height of the primitive coordinates for ID = ' +
            primitiveId);

        if(primitiveType == 'cylinder'){
          var cylinder = new MyCylinder(this.scene, primitiveId, slices, stacks, top, base, height);
          this.primitives[primitiveId] = cylinder;
        } else {
          var cylinder2 = new MyCylinder2(this.scene, primitiveId, slices, stacks, top, base, height);
          this.primitives[primitiveId] = cylinder2;
        }
      } else if (primitiveType == 'sphere') {
        // radius
        var radius = this.reader.getFloat(grandChildren[0], 'radius');
        if (!(radius != null && !isNaN(radius)))
          return (
            'unable to parse radius of the primitive coordinates for ID = ' +
            primitiveId);

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices)))
          return (
            'unable to parse slices of the primitive coordinates for ID = ' +
            primitiveId);

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
          return (
            'unable to parse stacks of the primitive coordinates for ID = ' +
            primitiveId);

        var sphere =
          new MySphere(this.scene, primitiveId, radius, slices, stacks);

        this.primitives[primitiveId] = sphere;
      } else if (primitiveType == 'torus') {
        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && slices >= 3))
          return (
            'unable to parse slices of the primitive coordinates for ID = ' +
            primitiveId);

        // loops
        var loops = this.reader.getFloat(grandChildren[0], 'loops');
        if (!(loops != null && !isNaN(loops) && loops >= 3))
          return (
            'unable to parse stacks of the primitive coordinates for ID = ' +
            primitiveId);

        // inner
        var inner = this.reader.getFloat(grandChildren[0], 'inner');
        if (!(inner != null && !isNaN(inner) && inner >= 0))
          return (
            'unable to parse inner of the primitive coordinates for ID = ' +
            primitiveId);

        // outer
        var outer = this.reader.getFloat(grandChildren[0], 'outer');
        if (!(outer != null && !isNaN(outer) && outer >= 0))
          return (
            'unable to parse outer of the primitive coordinates for ID = ' +
            primitiveId);

        var torus =
          new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

        this.primitives[primitiveId] = torus;
      } else if(primitiveType == 'plane') {
        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && npartsU > 0))
          return ('unable to parse npartsU of the primitive coordinates for ID = ' + primitiveId);

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && npartsV > 0))
          return ('unable to parse npartsV of the primitive coordinates for ID = ' + primitiveId);

        var plane = new MyPlane(this.scene, primitiveId, npartsU, npartsV);

        this.primitives[primitiveId] = plane;

      } else if(primitiveType == 'patch') {
        // npointsU
        var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU) && npointsU > 0))
          return ('unable to parse npointsU of the primitive coordinates for ID = ' + primitiveId);

        // npointsV
        var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV) && npointsV > 0))
          return ('unable to parse npointsV of the primitive coordinates for ID = ' + primitiveId);

        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && npartsU > 0))
          return ('unable to parse npartsU of the primitive coordinates for ID = ' + primitiveId);

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && npartsV > 0))
          return ('unable to parse npartsV of the primitive coordinates for ID = ' + primitiveId);

        // O número de pontos de controlo dentro da primitiva patch é npointsU * npointsV.
        var controlpointsNodes = grandChildren[0].children;
        var controlpointsIndex = 0;
        var controlpoints = [];
        for(let i = 0; i < npointsU; ++i){

          var controlpoint = [];

          for(let j = 0; j < npointsV; ++j){
            var xx = this.reader.getFloat(controlpointsNodes[controlpointsIndex], 'xx');
            var yy = this.reader.getFloat(controlpointsNodes[controlpointsIndex], 'yy');
            var zz = this.reader.getFloat(controlpointsNodes[controlpointsIndex], 'zz');

            if(!(xx != null && !isNaN(xx) && yy != null && !isNaN(yy) && zz != null && !isNaN(zz)))
              return ('unable to parse controlpoint ' + i + ' of the primitive coordinates for ID = ' + primitiveId);

            controlpoint.push([xx, yy, zz, 1]);
            ++controlpointsIndex;
          }

          controlpoints.push(controlpoint);
        }

        var patch = new MyPatch(this.scene, primitiveId, npartsU, npartsV, npointsU-1, npointsV-1, controlpoints);

        this.primitives[primitiveId] = patch;

      } else {
        console.warn('To do: Parse other primitives.');
      }
    }

    this.log('Parsed primitives');
    return null;
  }

  /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
  parseComponents(componentsNode) {
    var children = componentsNode.children;

    this.components = [];

    var grandChildren = [];
    var grandgrandChildren = [];
    var nodeNames = [];

    // Any number of components.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'component') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current component.
      var componentID = this.reader.getString(children[i], 'id');
      if (componentID == null) return 'no ID defined for componentID';

      // Checks for repeated IDs.
      if (this.components[componentID] != null)
        return ('ID must be unique for each component (conflict: ID = ' + componentID + ')');

      grandChildren = children[i].children;

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      var transformationIndex = nodeNames.indexOf('transformation');
      var animationIndex = nodeNames.indexOf('animationref');
      var materialsIndex = nodeNames.indexOf('materials');
      var textureIndex = nodeNames.indexOf('texture');
      var childrenIndex = nodeNames.indexOf('children');


      /* --- Transformations --- */
      var tranformationChildren = grandChildren[transformationIndex].children;
      var transfMatrix = mat4.create();

      if (tranformationChildren[0] == undefined) { }
      else if (tranformationChildren[0].nodeName == 'transformationref') {
        var idTrans = this.reader.getString(tranformationChildren[0], 'id');
        if (this.transformations[idTrans] == null) {
          return 'transformationref failed!';
        } else
          transfMatrix = this.transformations[idTrans];
      } else {
        for (var j = 0; j < tranformationChildren.length; j++) {
          switch (tranformationChildren[j].nodeName) {
            case 'translate':
              var coordinates = this.parseCoordinates3D(
                tranformationChildren[j],
                'translate transformation for component for ID' +
                componentID);
              if (!Array.isArray(coordinates)) return coordinates;

              mat4.translate(transfMatrix, transfMatrix, coordinates);
              break;

            case 'scale':
              var coordinates = this.parseCoordinates3D(
                tranformationChildren[j],
                'scale transformation for component for ID' + componentID);
              if (!Array.isArray(coordinates)) return coordinates;

              mat4.scale(transfMatrix, transfMatrix, coordinates);
              break;

            case 'rotate':
              // axis
              var axis =
                this.reader.getString(tranformationChildren[j], 'axis');
              // angle
              var angle =
                this.reader.getFloat(tranformationChildren[j], 'angle');

              if (axis == null || angle == null) {
                return 'failed to parse \'rotate\' from component';
              }

              var axisAux = vec3.create();
              if (axis == 'x')
                axisAux = vec3.fromValues(1, 0, 0);

              else if (axis == 'y')
                axisAux = [0, 1, 0];
              else if (axis == 'z')
                axisAux = vec3.fromValues(0, 0, 1);
              else
                return 'Unvalid axis fot rotation';

              mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, axisAux);

              break;
          }
        }
      }

      /* --- Animations --- */
      let animationNodeId = null;
      if(animationIndex != -1){
        animationNodeId = this.reader.getString(grandChildren[animationIndex], 'id');
      }

      /* --- Materials --- */
      var materialChildren = grandChildren[materialsIndex].children;
      let materialArray = [];

      for (let i = 0; i < materialChildren.length; i++) {
        let materialID = this.reader.getString(materialChildren[i], 'id');

        // check if material has a valid ID
        if (materialID == null) {
          this.onXMLMinorError("Error reading material id.");
          continue;
        }
        if (this.materials[materialID] == null && materialID != "inherit") {
          this.onXMLError('Material does not exist (' + materialID + ')');
          continue;
        }
        //check if root node has its own material
        if (componentID == this.root && materialID == "inherit") {
          this.onXMLMinorError('Root cannot have inherit materials');
          continue;
        }
        materialArray.push(materialID);
      }

      /* --- Texture --- */
      let textureInfo = grandChildren[textureIndex];

      let textureID = this.reader.getString(textureInfo, 'id');
      // Check Texture id
      if (textureID == null) {
        this.onXMLMinorError("Error reading texture id.");
        continue;
      }
      if (textureID != "none" && textureID != "inherit" && this.textures[textureID] == null) {
        this.onXMLMinorError("Error reading texture id.");
        continue;
      }
      let length_s,length_t;
      if (textureID != "none" && textureID != "inherit") {
        length_s = this.reader.getString(textureInfo, 'length_s');
        // Checking length_s
        if (length_s == null) {
          this.onXMLMinorError("Error reading texture length_s on '" + textureID + "'.");
          continue;
        }

        length_t = this.reader.getString(textureInfo, 'length_t');
        // Checking length_t
        if (length_t == null) {
          this.onXMLMinorError("Error reading texture length_t on '" + textureID + "'.");
          continue;
        }
      }


      /* --- Children --- */
      let childVec = grandChildren[childrenIndex].children;
      let componentChild = [];
      let primitiveChild = [];
      let child_iterator = -1;

      for (let child of childVec) {
        child_iterator++;
        let childID = this.reader.getString(childVec[child_iterator], 'id');
        if (child.nodeName == 'componentref') {
          if (childID == componentID)
            this.onXMLMinorError('Component' + id + 'includes itself.');
          else {
            if (!componentChild.includes(childID)) componentChild.push(childID);
          }
        } else if (child.nodeName == 'primitiveref') {
          if (!primitiveChild.includes(childID) && this.primitives[childID] != undefined) primitiveChild.push(childID);
        } else {
          this.onXMLMinorError('Invalid child nodeName.');
        }
      }

      // Parsing component properties
      this.components[componentID] = new MyComponent(componentID, materialArray, transfMatrix, textureID, length_s, length_t, componentChild, primitiveChild, animationNodeId);
    }

    this.log("Parsed components");
  }

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates3D(node, messageError) {
    var position = [];

    // x
    var x = this.reader.getFloat(node, 'x');
    if (!(x != null && !isNaN(x)))
      return 'unable to parse x-coordinate of the ' + messageError;

    // y
    var y = this.reader.getFloat(node, 'y');
    if (!(y != null && !isNaN(y)))
      return 'unable to parse y-coordinate of the ' + messageError;

    // z
    var z = this.reader.getFloat(node, 'z');
    if (!(z != null && !isNaN(z)))
      return 'unable to parse z-coordinate of the ' + messageError;

    position.push(...[x, y, z]);

    return position;
  }

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates4D(node, messageError) {
    var position = [];

    // Get x, y, z
    position = this.parseCoordinates3D(node, messageError);

    if (!Array.isArray(position)) return position;

    // w
    var w = this.reader.getFloat(node, 'w');
    if (!(w != null && !isNaN(w)))
      return 'unable to parse w-coordinate of the ' + messageError;

    position.push(w);

    return position;
  }

  /**
   * Parse the color components from a node
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseColor(node, messageError) {
    var color = [];

    // R
    var r = this.reader.getFloat(node, 'r');
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
      return 'unable to parse R component of the ' + messageError;

    // G
    var g = this.reader.getFloat(node, 'g');
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
      return 'unable to parse G component of the ' + messageError;

    // B
    var b = this.reader.getFloat(node, 'b');
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
      return 'unable to parse B component of the ' + messageError;

    // A
    var a = this.reader.getFloat(node, 'a');
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
      return 'unable to parse A component of the ' + messageError;

    color.push(...[r, g, b, a]);

    return color;
  }

  /*
   * Callback to be executed on any read error, showing an error on the console.
   * @param {string} message
   */
  onXMLError(message) {
    console.error('XML Loading Error: ' + message);
    this.loadedOk = false;
  }

  /**
   * Callback to be executed on any minor error, showing a warning on the
   * console.
   * @param {string} message
   */
  onXMLMinorError(message) {
    console.warn('Warning: ' + message);
  }

  /**
   * Callback to be executed on any message.
   * @param {string} message
   */
  log(message) {
    console.log('   ' + message);
  }

  /**
   * Displays the scene, processing each node, starting in the root node.
   */
  displayScene() {
    this.processNode(this.idRoot, "none", "none", 1, 1);
  }

  processNode(id, parentMaterial, parentTexture, parent_length_t, parent_length_s) {
    let comp = this.components[id];
    if (comp == null || comp == undefined) {
      this.onXMLError('Undefined component');
      return;
    }

    this.scene.pushMatrix();

    this.scene.multMatrix(comp.transformationMatrix);
    let animation = this.animations[comp.animationNodeId];
    if(animation != null) animation.apply();


    let apply_material = "none", apply_texture = "none",
        apply_length_t = 1, apply_length_s = 1, apply_mat_id = this.matID % comp.material.length;

    // Choose materials
    if (comp.material[apply_mat_id] == "inherit") {
      apply_material = parentMaterial;
    } else {
      apply_material = comp.material[apply_mat_id];
    }

    // Apply material
    if (apply_material != "none") {
      // None texture
      if (comp.textureID == "none") {
        this.materials[apply_material].setTexture(null);
      // Inherit texture
      } else if (comp.textureID == "inherit") {
        if (parentTexture == "none") {
          apply_texture = "none";
          this.materials[apply_material].setTexture(null);
        } else {
          apply_length_t = parent_length_t;
          apply_length_s = parent_length_s;
          apply_texture = parentTexture;
          this.materials[apply_material].setTexture(this.textures[apply_texture]);
        }
      // Defined texture
      } else {
        apply_length_t = comp.length_t;
        apply_length_s = comp.length_s;
        apply_texture = comp.textureID
        this.materials[apply_material].setTexture(this.textures[apply_texture]);
      }
      this.materials[apply_material].apply();
    }

    // display child primitives
    for (let childPrim of comp.primitiveChild) {
      if (apply_material != "none" && apply_texture != "none") {
        this.primitives[childPrim].updateTexCoords(apply_length_t, apply_length_s);
      }

      this.primitives[childPrim].display();
    }
    // process child components
    for (let childComp of comp.componentChild) {
      this.processNode(childComp, apply_material, apply_texture, apply_length_t, apply_length_s);
    }

    this.scene.popMatrix();
  }

  nextMaterial() {
    this.matID++;
  }

  update(t){
    for(let id in this.animations){
      let anim = this.animations[id];
      anim.update(t);
    }
  }
}

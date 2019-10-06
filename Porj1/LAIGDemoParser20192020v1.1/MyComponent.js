class MyComponent{
    constructor(id, transformationMatrix, arrayMaterials, /*textId, length_s, length_t,*/ componentChild, primitiveChild){
        this.id = id;
        this.transformationMatrix = transformationMatrix;
        this.arrayMaterials = arrayMaterials;
        /*this.textId = textId;
        this.length_s = length_s;
        this.length_t = length_t; */
        this.componentChild = componentChild;
        this.primitiveChild = primitiveChild;
    }
}
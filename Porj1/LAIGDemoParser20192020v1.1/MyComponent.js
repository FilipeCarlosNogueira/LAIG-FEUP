class MyComponent{
    constructor(id, materialID, transformationMatrix, /*textId, length_s, length_t,*/ componentChild, primitiveChild){
        this.id = id;
        this.materialID = materialID;
        this.transformationMatrix = transformationMatrix;
        /*this.textId = textId;
        this.length_s = length_s;
        this.length_t = length_t; */
        this.componentChild = componentChild;
        this.primitiveChild = primitiveChild;
    }
}
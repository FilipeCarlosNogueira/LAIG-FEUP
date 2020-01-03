include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}
serialInclude([ '../lib/CGF.js',
                'XMLscene.js',
                'MySceneGraph.js',
                'MyAnimation.js',
                'game_controllers/MyBoard.js',
                'game_controllers/MyPieceAnimation.js',
                'game_controllers/newG.js',
                'game_controllers/MyGameMove.js',
                'MyInterface.js',
                'MyComponent.js',
                'primitives/MyRectangle.js',
                'primitives/MyCylinder.js',
                'primitives/MyTriangle.js',
                'primitives/MySphere.js',
                'primitives/MyTorus.js',
                'primitives/MyPlane.js',
                'primitives/MyPatch.js',
                'primitives/MyCylinder2.js',
                'primitives/MyPiece.js',
                'primitives/MyTile.js',
                'Server.js',
main=function() {
    let app         = new CGFapplication(document.body);
    let myInterface = new MyInterface();
    let myScene     = new XMLscene(myInterface);
    app.init();
    app.setScene(myScene);
    app.setInterface(myInterface);
    myInterface.setActiveCamera(myScene.camera);
    app.run();
}
]);

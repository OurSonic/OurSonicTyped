System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GameState, ClickState, ChunkLayerState, RotationMode;
    return {
        setters:[],
        execute: function() {
            (function (GameState) {
                GameState[GameState["Playing"] = 0] = "Playing";
                GameState[GameState["Editing"] = 1] = "Editing";
            })(GameState || (GameState = {}));
            exports_1("GameState", GameState);
            (function (ClickState) {
                ClickState[ClickState["Dragging"] = 0] = "Dragging";
                ClickState[ClickState["PlaceChunk"] = 1] = "PlaceChunk";
                ClickState[ClickState["PlaceRing"] = 2] = "PlaceRing";
                ClickState[ClickState["PlaceObject"] = 3] = "PlaceObject";
            })(ClickState || (ClickState = {}));
            exports_1("ClickState", ClickState);
            (function (ChunkLayerState) {
                ChunkLayerState[ChunkLayerState["Low"] = 0] = "Low";
                ChunkLayerState[ChunkLayerState["High"] = 1] = "High";
            })(ChunkLayerState || (ChunkLayerState = {}));
            exports_1("ChunkLayerState", ChunkLayerState);
            (function (RotationMode) {
                RotationMode[RotationMode["Floor"] = 134] = "Floor";
                RotationMode[RotationMode["RightWall"] = 224] = "RightWall";
                RotationMode[RotationMode["Ceiling"] = 314] = "Ceiling";
                RotationMode[RotationMode["LeftWall"] = 44] = "LeftWall";
            })(RotationMode || (RotationMode = {}));
            exports_1("RotationMode", RotationMode);
        }
    }
});

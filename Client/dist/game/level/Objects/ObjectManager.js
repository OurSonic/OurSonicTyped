System.register(["../../../common/Help", "./LevelObjectAsset", "./LevelObjectAssetFrame", "./LevelObjectProjectile", "./LevelObject", "./LevelObjectPieceLayout"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Help_1, LevelObjectAsset_1, LevelObjectAssetFrame_1, LevelObjectProjectile_1, LevelObject_1, LevelObjectPieceLayout_1;
    var ObjectManager;
    return {
        setters:[
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (LevelObjectAsset_1_1) {
                LevelObjectAsset_1 = LevelObjectAsset_1_1;
            },
            function (LevelObjectAssetFrame_1_1) {
                LevelObjectAssetFrame_1 = LevelObjectAssetFrame_1_1;
            },
            function (LevelObjectProjectile_1_1) {
                LevelObjectProjectile_1 = LevelObjectProjectile_1_1;
            },
            function (LevelObject_1_1) {
                LevelObject_1 = LevelObject_1_1;
            },
            function (LevelObjectPieceLayout_1_1) {
                LevelObjectPieceLayout_1 = LevelObjectPieceLayout_1_1;
            }],
        execute: function() {
            ObjectManager = (function () {
                function ObjectManager(sonicManager) {
                    this.sonicManager = sonicManager;
                }
                ObjectManager.prototype.Init = function () {
                };
                ObjectManager.ExtendObject = function (d) {
                    var obj = Help_1.Help.merge(new LevelObject_1.LevelObject(d.key), {
                        collideScript: d.collideScript,
                        hurtScript: d.hurtScript,
                        initScript: d.initScript,
                        tickScript: d.tickScript
                    });
                    obj.description = d.description;
                    obj.assets = [];
                    for (var i = 0; i < d.assets.length; i++) {
                        var asset = d.assets[i];
                        var levelObjectAsset = Help_1.Help.merge(new LevelObjectAsset_1.LevelObjectAsset(asset.name), { name: asset.name });
                        levelObjectAsset.frames = [];
                        for (var index = 0; index < asset.frames.length; index++) {
                            var fr = asset.frames[index];
                            levelObjectAsset.frames[index] = Help_1.Help.merge(new LevelObjectAssetFrame_1.LevelObjectAssetFrame(fr.name), {
                                offsetX: fr.offsetX,
                                width: fr.width,
                                transparentColor: fr.transparentColor || "000000",
                                height: fr.height,
                                offsetY: fr.offsetY,
                                hurtSonicMap: fr.hurtSonicMap,
                                collisionMap: fr.collisionMap,
                                colorMap: fr.colorMap,
                                palette: fr.palette
                            });
                        }
                        obj.assets[i] = levelObjectAsset;
                    }
                    obj.pieces = [];
                    for (var index = 0; index < d.pieces.length; index++) {
                        var piece = d.pieces[index];
                        obj.pieces[index] = piece;
                    }
                    obj.pieceLayouts = [];
                    for (var index = 0; index < d.pieceLayouts.length; index++) {
                        var pl = d.pieceLayouts[index];
                        obj.pieceLayouts[index] = Help_1.Help.merge(new LevelObjectPieceLayout_1.LevelObjectPieceLayout(pl.name), {
                            height: pl.height,
                            width: pl.width
                        });
                        obj.pieceLayouts[index].pieces = [];
                        for (var i = 0; i < d.pieceLayouts[index].pieces.length; i++) {
                            obj.pieceLayouts[index].pieces[i] = d.pieceLayouts[index].pieces[i];
                        }
                    }
                    obj.projectiles = [];
                    for (var index = 0; index < d.projectiles.length; index++) {
                        var proj = d.projectiles[index];
                        proj = Help_1.Help.merge(new LevelObjectProjectile_1.LevelObjectProjectile(proj.name), {
                            x: proj.x,
                            y: proj.y,
                            xsp: proj.xsp,
                            ysp: proj.ysp,
                            xflip: proj.xflip,
                            yflip: proj.yflip,
                            assetIndex: proj.assetIndex,
                            frameIndex: proj.frameIndex
                        });
                        obj.projectiles[index] = proj;
                    }
                    return obj;
                };
                ObjectManager.broken = Help_1.Help.loadSprite("assets/sprites/broken.png", function (e) {
                });
                return ObjectManager;
            }());
            exports_1("ObjectManager", ObjectManager);
        }
    }
});
//# sourceMappingURL=ObjectManager.js.map
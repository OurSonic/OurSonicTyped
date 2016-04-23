import {Help } from "../../../Common/Help";
import {SonicManager } from "../../SonicManager";

export class ObjectManager {
    private static broken  = Help.loadSprite("assets/Sprites/broken.png", (e) => {});
    private sonicManager: SonicManager;
    constructor(sonicManager: SonicManager) {
        this.sonicManager = sonicManager;
    }
    public init(): void {
        
    }
    public static extendObject(d: LevelObjectData): LevelObject {
        var obj = Help.merge(new LevelObject(d.key), {
            collideScript: d.collideScript,
            hurtScript: d.hurtScript,
            initScript: d.initScript,
            tickScript: d.tickScript
        });
        obj.description = d.description;
        obj.assets = [];
        for (var i: number = 0; i < d.assets.count; i++) {
            var asset = d.assets[i];
            var levelObjectAsset = Help.merge(new LevelObjectAsset(asset.name), { name: asset.name });
            levelObjectAsset.frames = [];
            for (var index: number = 0; index < asset.frames.count; index++) {
                var fr = asset.frames[index];
                levelObjectAsset.frames[index] = Help.merge(new LevelObjectAssetFrame(fr.name), {
                    offsetX: fr.offsetX,
                    width: fr.width,
                    transparentColor: fr.transparentColor,
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
        for (var index: number = 0; index < d.pieces.count; index++) {
            var piece = d.pieces[index];
            obj.pieces[index] = piece;
        }
        obj.pieceLayouts = [];
        for (var index: number = 0; index < d.pieceLayouts.count; index++) {
            var pl = d.pieceLayouts[index];
            obj.pieceLayouts[index] = Help.merge(new LevelObjectPieceLayout(pl.name), {
                height: pl.height,
                width: pl.width
            });
            obj.pieceLayouts[index].pieces = [];
            for (var i: number = 0; i < d.pieceLayouts[index].pieces.count; i++) {
                obj.pieceLayouts[index].pieces[i] = d.pieceLayouts[index].pieces[i];
            }
        }
        obj.projectiles = [];
        for (var index: number = 0; index < d.projectiles.count; index++) {
            var proj = d.projectiles[index];
            proj = Help.merge(new LevelObjectProjectile(proj.name), {
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
    }
}
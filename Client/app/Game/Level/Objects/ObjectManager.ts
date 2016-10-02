import {Help } from "../../../common/Help";
import {SonicManager } from "../../SonicManager"; 
import {LevelObjectAsset } from "./LevelObjectAsset";
import {LevelObjectAssetFrame } from "./LevelObjectAssetFrame";
import {LevelObjectProjectile } from "./LevelObjectProjectile";
import {LevelObjectData} from "./LevelObjectData";
import {LevelObject } from "./LevelObject";
import {LevelObjectPiece} from "./LevelObjectPiece";
import {LevelObjectPieceLayout } from "./LevelObjectPieceLayout";
import {LevelObjectPieceLayoutPiece} from "./LevelObjectPieceLayoutPiece";

export class ObjectManager {
    public static broken = Help.loadSprite("assets/sprites/broken.png", (e) => {

    });
    private sonicManager: SonicManager;
    constructor(sonicManager: SonicManager) {
        this.sonicManager = sonicManager;
    }
    public Init(): void {

    }
    public static ExtendObject(d: LevelObjectData): LevelObject {
        let obj: LevelObject = Help.merge(new LevelObject(d.key), {
            CollideScript: d.collideScript,
            HurtScript: d.hurtScript,
            InitScript: d.initScript,
            TickScript: d.tickScript
        });
        obj.description = d.description;
        obj.assets = new Array<LevelObjectAsset>();
        for (let i: number = 0; i < d.assets.length; i++) {
            let asset = d.assets[i];
            let levelObjectAsset = Help.merge(new LevelObjectAsset(asset.name), { name: asset.name });
            levelObjectAsset.frames = new Array<LevelObjectAssetFrame>();
            for (let index: number = 0; index < asset.frames.length; index++) {
                let fr = asset.frames[index];
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
        obj.pieces = new Array<LevelObjectPiece>();
        for (let index: number = 0; index < d.pieces.length; index++) {
            let piece = d.pieces[index];
            obj.pieces[index] = piece;
        }
        obj.pieceLayouts = new Array<LevelObjectPieceLayout>();
        for (let index: number = 0; index < d.pieceLayouts.length; index++) {
            let pl = d.pieceLayouts[index];
            obj.pieceLayouts[index] = Help.merge(new LevelObjectPieceLayout(pl.name), {
                height: pl.height,
                width: pl.width
            });
            obj.pieceLayouts[index].pieces = new Array<LevelObjectPieceLayoutPiece>();
            for (let i: number = 0; i < d.pieceLayouts[index].pieces.length; i++) {
                obj.pieceLayouts[index].pieces[i] = d.pieceLayouts[index].pieces[i];
            }
        }
        obj.projectiles = new Array<LevelObjectProjectile>();
        for (let index: number = 0; index < d.projectiles.length; index++) {
            let proj = d.projectiles[index];
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
﻿import {Help } from "../../../Common/Help";
import {SonicManager } from "../../SonicManager"; 
import {LevelObjectAsset } from "LevelObjectAsset";
import {LevelObjectAssetFrame } from "LevelObjectAssetFrame";
import {LevelObjectProjectile } from "LevelObjectProjectile";
import {LevelObjectData} from "LevelObjectData";
import {LevelObject } from "LevelObject";
import {LevelObjectPiece} from "LevelObjectPiece";
import {LevelObjectPieceLayout } from "LevelObjectPieceLayout";
import {LevelObjectPieceLayoutPiece} from "LevelObjectPieceLayoutPiece";

export class ObjectManager {
    public static broken = Help.LoadSprite("assets/Sprites/broken.png", (e) => {

    });
    private sonicManager: SonicManager;
    constructor(sonicManager: SonicManager) {
        this.sonicManager = sonicManager;
    }
    public Init(): void {

    }
    public static ExtendObject(d: LevelObjectData): LevelObject {
        var obj: LevelObject = Help.Merge(new LevelObject(d.Key), {
            CollideScript: d.CollideScript,
            HurtScript: d.HurtScript,
            InitScript: d.InitScript,
            TickScript: d.TickScript
        });
        obj.Description = d.Description;
        obj.Assets = new Array<LevelObjectAsset>();
        for (var i: number = 0; i < d.Assets.length; i++) {
            var asset = d.Assets[i];
            var levelObjectAsset = Help.Merge(new LevelObjectAsset(asset.Name), { Name: asset.Name });
            levelObjectAsset.Frames = new Array<LevelObjectAssetFrame>();
            for (var index: number = 0; index < asset.Frames.length; index++) {
                var fr = asset.Frames[index];
                levelObjectAsset.Frames[index] = Help.Merge(new LevelObjectAssetFrame(fr.Name), {
                    OffsetX: fr.OffsetX,
                    Width: fr.Width,
                    TransparentColor: fr.TransparentColor,
                    Height: fr.Height,
                    OffsetY: fr.OffsetY,
                    HurtSonicMap: fr.HurtSonicMap,
                    CollisionMap: fr.CollisionMap,
                    ColorMap: fr.ColorMap,
                    Palette: fr.Palette
                });
            }
            obj.Assets[i] = levelObjectAsset;
        }
        obj.Pieces = new Array<LevelObjectPiece>();
        for (var index: number = 0; index < d.Pieces.length; index++) {
            var piece = d.Pieces[index];
            obj.Pieces[index] = piece;
        }
        obj.PieceLayouts = new Array<LevelObjectPieceLayout>();
        for (var index: number = 0; index < d.PieceLayouts.length; index++) {
            var pl = d.PieceLayouts[index];
            obj.PieceLayouts[index] = Help.Merge(new LevelObjectPieceLayout(pl.Name), {
                Height: pl.Height,
                Width: pl.Width
            });
            obj.PieceLayouts[index].Pieces = new Array<LevelObjectPieceLayoutPiece>();
            for (var i: number = 0; i < d.PieceLayouts[index].Pieces.length; i++) {
                obj.PieceLayouts[index].Pieces[i] = d.PieceLayouts[index].Pieces[i];
            }
        }
        obj.Projectiles = new Array<LevelObjectProjectile>();
        for (var index: number = 0; index < d.Projectiles.length; index++) {
            var proj = d.Projectiles[index];
            proj = Help.Merge(new LevelObjectProjectile(proj.Name), {
                X: proj.X,
                Y: proj.Y,
                Xsp: proj.Xsp,
                Ysp: proj.Ysp,
                Xflip: proj.Xflip,
                Yflip: proj.Yflip,
                AssetIndex: proj.AssetIndex,
                FrameIndex: proj.FrameIndex
            });
            obj.Projectiles[index] = proj;
        }
        return obj;
    }
}
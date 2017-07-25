import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../common/Utils";
import {CanvasInformation} from "../common/CanvasInformation";
import {SonicEngine} from "./SonicEngine";
import {SonicImage} from "./level/SonicImage";
import {GameState, ClickState, ChunkLayerState} from "../common/Enums";
import {Help} from "../common/Help";
import {Sonic} from "./sonic/Sonic";
import {HeightMap} from "./level/HeightMap";
import {ObjectManager} from "./level/Objects/ObjectManager";
import {SonicLevel, PaletteItem, PaletteItemPieces} from "./SonicLevel";
import {LevelObjectInfo} from "./level/Objects/LevelObjectInfo";
import {Ring} from "./level/Ring";
import {SpriteCache} from "./level/SpriteCache";
import {TileAnimationData, TileAnimationDataFrame} from "./level/Animations/TileAnimationData";
import {AnimationInstance,} from "./level/Animations/AnimationInstance";
import {TilePaletteAnimationManager} from "./level/Tiles/TilePaletteAnimationManager";
import {TileAnimationManager} from "./level/Tiles/TileAnimationManager";
import {TileChunkDebugDrawOptions, TileChunk} from "./level/Tiles/TileChunk";
import {SpriteLoader} from "../common/SpriteLoader";
import {SonicBackground} from "./level/SonicBackground";
import {LevelObject} from "./level/Objects/LevelObject";
import {LevelObjectData} from "./level/Objects/LevelObjectData";
import {SLData as SlData, AnimatedPaletteItem} from "../SLData";
import {Tile} from "./level/Tiles/Tile";
import {TilePiece} from "./level/Tiles/TilePiece";
import {TileInfo} from "./level/Tiles/TileInfo";
import {TilePieceInfo} from "./level/Tiles/TilePieceInfo";

export class SonicManager {
    public static instance: SonicManager;
    private static _cachedOffs: { [key: number]: Point[] } = {};
    private engine: SonicEngine;
    public objectManager: ObjectManager;
    public drawTickCount: number;
    private clicking: boolean;
    private imageLength: number;
    private sonicSprites: { [key: string]: SonicImage } = {};
    public tickCount: number;
    private waitingForDrawContinue: boolean;
    public waitingForTickContinue: boolean;
    public currentGameState: GameState;
    public bigWindowLocation: IntersectingRectangle;
    public sonicToon: Sonic;
    public scale: Point;
    public windowLocation: IntersectingRectangle;
    public inHaltMode: boolean;
    public tileAnimations: TileAnimationData[];
    public animationInstances: AnimationInstance[];
    public goodRing: Ring;
    public showHeightMap: boolean;
    public activeRings: Ring[];
    public forceResize: () => void;
    public background: SonicBackground;
    public clickState: ClickState;
    public sonicLevel: SonicLevel;
    public inFocusObjects: LevelObjectInfo[];
    protected loading: boolean;
    public spriteCache: SpriteCache;
    protected spriteLoader: SpriteLoader;
    public onLevelLoad: (_: SonicLevel) => void;
    public tilePaletteAnimationManager: TilePaletteAnimationManager;
    public tileAnimationManager: TileAnimationManager;



    constructor(engine: SonicEngine,  resize: () => void) {
        SonicManager.instance = this;


        (<any>window).OurSonic = {SonicManager: {instance: SonicManager.instance}, SonicEngine: engine};
        this.engine = engine;

        jQuery.getJSON("assets/content/sprites/sonic.json", (data: { [key: string]: SonicImage }) => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        let scl: number = 2;
        this.scale = new Point(scl, scl);
        this.windowLocation = Help.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation = Help.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation.width = (this.bigWindowLocation.width * 1.8) | 0;
        this.bigWindowLocation.height = (this.bigWindowLocation.height * 1.8) | 0;
        this.tileAnimations = [];
        this.animationInstances = [];
        this.showHeightMap = false;
        this.goodRing = new Ring(false);
        this.activeRings = [];
        this.forceResize = resize;
        this.background = null;
        this.currentGameState = GameState.Editing;
        this.clickState = ClickState.PlaceChunk;
        this.tickCount = 0;
        this.drawTickCount = 0;
        this.inHaltMode = false;
        this.waitingForTickContinue = false;
        this.waitingForDrawContinue = false;
        /*
         this.tileChunkDebugDrawOptions = new TileChunkDebugDrawOptions();
         this.tileChunkDebugDrawOptions.outlineTilePieces=true;
         this.tileChunkDebugDrawOptions.putlineChunk=true;
         this.tileChunkDebugDrawOptions.outlineTiles=true;
         */

    }

    public onClick(event: JQueryEventObject): boolean {
        this.clicking = true;
        if (this.effectClick(event))
            return true;
        return false;
    }

    private effectClick(event: JQueryEventObject): boolean {
        if (!this.sonicLevel) return;
        let e = new Point((event.clientX / this.scale.x  + this.windowLocation.x),
            (event.clientY / this.scale.y+ this.windowLocation.y));
        let ey: number;
        let ex: number;
        if (event.ctrlKey) {
            ex = e.x / 128 | 0;
            ey = e.y / 128 | 0;
            let ch = this.sonicLevel.getChunkAt(ex, ey);
            //            if (this.UIManager.UIManagerAreas.TilePieceArea != null)
            //                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, this.UIManager.UIManagerAreas.TilePieceArea.Data, true);
            return true;
        }
        if (event.shiftKey) {
            ex = e.x / 128 | 0;
            ey = e.y / 128 | 0;
            let ch = this.sonicLevel.getChunkAt(ex, ey);
            //            if (this.UIManager.UIManagerAreas.TileChunkArea != null)
            //                this.SonicLevel.SetChunkAt(ex, ey, this.UIManager.UIManagerAreas.TileChunkArea.Data);
            return true;
        }
        if (event.button === 0) {
            switch (this.clickState) {
                case ClickState.Dragging:
                    return true;
                case ClickState.PlaceChunk: {
                    ex = e.x / 128 | 0;
                    ey = e.y / 128 | 0;
                    let ch = this.sonicLevel.getChunkAt(ex, ey);
                    let tp = ch.getTilePieceAt(e.x - ex * 128, e.y - ey * 128, true);
                    let dontClear: boolean = false;
                    //                    if (this.UIManager.UIManagerAreas.TileChunkArea != null) {
                    //                        if (this.UIManager.UIManagerAreas.TileChunkArea.Data == ch)
                    //                            dontClear = true;
                    //                        this.UIManager.UIManagerAreas.TileChunkArea.Data = ch;
                    //                    }
                    //                    if (this.UIManager.UIManagerAreas.TilePieceArea != null) {
                    //                        if (this.UIManager.UIManagerAreas.TilePieceArea.Data != tp)
                    //                            dontClear = true;
                    //                        this.UIManager.UIManagerAreas.TilePieceArea.Data = tp;
                    //                    }
                    // this.clearCache();
                    return true;

                }
                case ClickState.PlaceRing:
                    ex = e.x;
                    ey = e.y;
                    this.sonicLevel.rings.push(Help.merge(new Ring(true), {X: ex, Y: ey}));
                    return true;
                case ClickState.PlaceObject: {
                    ex = e.x;
                    ey = e.y;
                    let pos = new Point(ex, ey);
                    for (let o of this.sonicLevel.objects) {
                        if (IntersectingRectangle.IntersectsRect(o.getRect(), pos))
                            alert("Object Data: " + Help.stringify(o));
                    }
                    return true;
                }
            }
        }
        return false;
    }

    private tickObjects(): void {
        this.inFocusObjects = [];
        let levelObjectInfos = this.sonicLevel.objects;
        for (let obj of levelObjectInfos) {
            if (this.bigWindowLocation.Intersects(obj.x | 0, obj.y | 0)) {
                this.inFocusObjects.push(obj);
                obj.tick(obj, this.sonicLevel, this.sonicToon);
            }
        }
        //        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
        //            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
        for (let animationInstance of this.animationInstances) {
            animationInstance.Tick();
        }
    }

    public tick(): void {
        if (this.loading)
            return;
        if (this.currentGameState === GameState.Playing) {
            if (this.inHaltMode) {
                if (this.waitingForTickContinue)
                    return;
            }
            this.tickCount++;
            this.tickObjects();
            this.sonicToon.ticking = true;
            try {
                this.sonicToon.tick(this.sonicLevel);
            }

            finally {
                this.sonicToon.ticking = false;
            }
            if (this.inHaltMode) {
                if (this.waitingForTickContinue)
                    return;
                this.waitingForTickContinue = true;
                this.waitingForDrawContinue = false;
            }
        }
    }

    public preloadSprites(completed: () => void, update: (_: string) => void): void {
        if (this.spriteCache != null) {
            completed();
            return;
        }
        this.spriteCache = this.spriteCache != null ? this.spriteCache : new SpriteCache();
        let ci = this.spriteCache.Rings;
        let spriteLocations: string[] = [];
        for (let j: number = 0; j < 4; j++) {
            spriteLocations.push(`assets/sprites/ring${j}.png`);
            this.imageLength++;
        }
        let ind_ = this.spriteCache.Indexes;
        this.spriteLoader = new SpriteLoader(completed, update);
        if (ci.length == 0) {
            let spriteStep = this.spriteLoader.AddStep("Sprites",
                (i, done) => {
                    Help.loadSprite(spriteLocations[i],
                        jd => {
                            ci[i] = CanvasInformation.create(jd.width, jd.height, false);
                            ci[i].context.drawImage(jd, 0, 0);
                            done();
                        });
                },
                () => {
                    ind_.Sprites++;
                    if (ind_.Sprites == 4)
                        return true;
                    return false;
                },
                false);
            for (let i = 0; i < spriteLocations.length; i++) {
                this.spriteLoader.addIterationToStep(spriteStep, i);
            }
        }
        let cci = this.spriteCache.SonicSprites;

        if (Object.keys(cci).length == 0) {
            let sonicStep = this.spriteLoader.AddStep("Sonic Sprites",
                (sp, done) => {
                    for (let sonicSprite in this.sonicSprites) {
                        cci[sonicSprite] = Help.scaleCsImage(this.sonicSprites[sonicSprite], new Point(1, 1), (ec) => {

                        });
                    }
                    done();
                },
                () => true,
                false);
            this.spriteLoader.addIterationToStep(sonicStep, 0);
        }
    }

    public mainDraw(): void {
        if (this.inHaltMode)
            if (this.drawHaltMode(this.engine.highTileCanvas.context))
                return;
        if (this.sonicLevel === undefined)
            return;
        this.drawTickCount++;
        if (this.spriteLoader && !this.spriteLoader.Tick() || this.loading) {
            SonicManager.drawLoading(this.engine.spriteCanvas.context);
            return;
        }
        this.updatePositions();
        this.tilePaletteAnimationManager.TickAnimatedPalettes();
        this.tileAnimationManager.TickAnimatedTiles();
        this.resetCanvases();
        if (this.background) {
            /*
                        let wOffset: number = this.windowLocation.x;
                        let bw: number = this.background.Width;
                        let movex: number = (wOffset / bw) * bw;
                        localPoint.x = -this.windowLocation.x + movex;
                        localPoint.y = -this.windowLocation.y / 4;
                        this.background.Draw(this.lowTileCanvas.context, localPoint, wOffset);
                        localPoint.x = -this.windowLocation.x + movex + this.background.Width;
                        localPoint.y = -this.windowLocation.y / 4;
                        this.background.Draw(this.lowTileCanvas.context, localPoint, wOffset);
            */
        }
        this.drawChunksPixel(this.windowLocation.x, this.windowLocation.y);

        this.drawObjects(this.engine.spriteCanvas.context);
        this.drawAnimations(this.engine.spriteCanvas.context);
        this.drawRings(this.engine.spriteCanvas.context);
        this.drawSonic(this.engine.spriteCanvas.context);


        if (this.showHeightMap || this.currentGameState == GameState.Editing) {

            let w1: number = (this.windowLocation.width / 128 | 0) + 2;
            let h1: number = (this.windowLocation.height / 128 | 0) + 2;
            let offs = SonicManager.getOffs(w1, h1);

            let fxP: number = ((this.windowLocation.x) / 128) | 0;
            let fyP: number = ((this.windowLocation.y) / 128) | 0;
            for (let off of offs) {
                let _xP: number = fxP + off.x;
                let _yP: number = fyP + off.y;
                let _xPreal: number = fxP + off.x;
                let _yPreal: number = fyP + off.y;
                _xP = Help.mod(_xP, this.sonicLevel.levelWidth);
                _yP = Help.mod(_yP, this.sonicLevel.levelHeight);
                let chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                if (chunk == null)
                    continue;
                let x = (_xPreal * 128) - this.windowLocation.x | 0;
                let y = (_yPreal * 128) - this.windowLocation.y | 0;
                if (this.showHeightMap) {
                    let fd = this.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + chunk.Index];
                    if (fd == null) {
                        fd = this.cacheHeightMapForChunk(chunk);
                    }
                    this.engine.highTileCanvas.context.drawImage(fd.canvas, x, y);
                }
                if (this.currentGameState == GameState.Editing) {
                    this.engine.highTileCanvas.context.strokeStyle = "#DD0033";
                    this.engine.highTileCanvas.context.lineWidth = 1;
                    this.engine.highTileCanvas.context.strokeRect(x, y, 128, 128);
                }
            }
        }


         // this.sonicToon.drawUI(context, new Point(this.screenOffset.x, this.screenOffset.y));
    }



    public resetCanvases(): void {
        this.engine.spriteCanvas.context.clearRect(0, 0, 320, 224);
    }


    private static getOffs(w1: number, h1: number): Point[] {
        let hash: number = (w1 + 1) * (h1 + 1);
        if (SonicManager._cachedOffs[hash])
            return SonicManager._cachedOffs[hash];
        let offs = new Array(0);
        let ca = 0;
        for (let y: number = -1; y < h1; y++)
            for (let x: number = -1; x < w1; x++)
                offs[ca++] = (new Point(x, y));
        return SonicManager._cachedOffs[hash] = offs;
    }

    private updatePositions(): void {
        if (this.currentGameState == GameState.Playing)
            this.updatePositionsForPlaying();
    }

    private updatePositionsForPlaying(): void {
        if (this.sonicToon.ticking) {
            while (true) {
                if (this.sonicToon.ticking)
                    break;
            }
        }
        this.windowLocation.x = (this.sonicToon.x) - this.windowLocation.width / 2;
        this.windowLocation.y = (this.sonicToon.y) - this.windowLocation.height / 2;
        this.bigWindowLocation.x = (this.sonicToon.x) - this.bigWindowLocation.width / 2;
        this.bigWindowLocation.y = (this.sonicToon.y) - this.bigWindowLocation.height / 2;
        this.bigWindowLocation.x = (this.bigWindowLocation.x - this.windowLocation.width * 0.2);
        this.bigWindowLocation.y = (this.bigWindowLocation.y - this.windowLocation.height * 0.2);
        this.bigWindowLocation.width = (this.windowLocation.width * 1.8);
        this.bigWindowLocation.height = (this.windowLocation.height * 1.8);
    }

    private static drawLoading(canvas: CanvasRenderingContext2D): void {
        canvas.fillStyle = "white";
        canvas.fillText("loading...   ", 95, 95);
        canvas.restore();
    }

    private drawHaltMode(canvas: CanvasRenderingContext2D): boolean {
        canvas.fillStyle = "white";
        canvas.font = "21pt arial bold";
        canvas.fillText("HALT MODE\r\n Press: P to step\r\n        O to resume", 10, 120);
        if (this.waitingForDrawContinue)
            return true;
        else this.waitingForDrawContinue = true;
        return false;
    }


    width: number = 320;
    height: number = 224;

    lowCacheImageData = new ImageData(320 + 16 * 2, 224 + 16 * 2);
    lowCacheBuffer = new Uint32Array(this.lowCacheImageData.data.buffer);
    highCacheImageData = new ImageData(320 + 16 * 2, 224 + 16 * 2);
    highCacheBuffer = new Uint32Array(this.highCacheImageData.data.buffer);

    private drawChunksPixel(windowX: number, windowY: number): void {
        let levelWidthPixels = this.sonicLevel.levelWidth * 128;
        let levelHeightPixels = this.sonicLevel.levelHeight * 128;

        windowX = Help.mod(windowX - 16, levelWidthPixels);
        windowY = Help.mod(windowY - 16, levelHeightPixels);

        let lowBuffer = this.lowCacheBuffer;
        let highBuffer = this.highCacheBuffer;

        lowBuffer.fill(0)
        highBuffer.fill(0)

        var endX = windowX + 320 + 16 * 2;
        var endY = windowY + 224 + 16 * 2;

        let drawX = 0;
        let drawY = 0;
        for (let x = windowX; x < endX; x++) {
            let repositionedX = Help.mod(x, levelWidthPixels);
            drawX += 1;
            drawY = 0;
            for (let y = windowY; y < endY; y++) {
                let repositionedY = Help.mod(y, levelHeightPixels);
                drawY += 1;

                let chunkX = (repositionedX / 128) | 0;
                let chunkY = (repositionedY / 128) | 0;

                let chunk = this.sonicLevel.getChunkAt(chunkX, chunkY);
                if (chunk === undefined)
                    continue;
                if (chunk.isEmpty === true)
                    continue;

                let tilePieceX = ((repositionedX / 16) | 0) - chunkX * 8;
                let tilePieceY = ((repositionedY / 16) | 0) - chunkY * 8;

                let tpX = chunk.TilePieces[tilePieceX];
                if (tpX === undefined) {
                    continue;
                }
                let pieceInfo = tpX[tilePieceY];
                if (pieceInfo === undefined) {
                    continue;
                }
                let piece = pieceInfo.getTilePiece();
                if (piece === undefined) {
                    continue;
                }
                let drawOrderIndex = pieceInfo.XFlip ? (pieceInfo.YFlip ? 0 : 1) : (pieceInfo.YFlip ? 2 : 3);

                let tileX = ((repositionedX / 8) | 0) - chunkX * 16 - tilePieceX * 2;
                let tileY = ((repositionedY / 8) | 0) - chunkY * 16 - tilePieceY * 2;
                let drawOrder = TilePiece.DrawOrder[drawOrderIndex];
                let tileIndex = tileY * 2 + tileX;
                let tileNumber = drawOrder[tileIndex];
                let tileItem = piece.Tiles[tileNumber];


                let tile = tileItem.GetTile();
                if (tile === undefined)
                    continue;

                let palette_ = SonicManager.instance.sonicLevel.palette;
                let colorPaletteIndex: number = tileItem.Palette;

                let pixelX = repositionedX - (chunkX * 128 + tilePieceX * 16 + tileX * 8);
                let pixelY = repositionedY - (chunkY * 128 + tilePieceY * 16 + tileY * 8);


                let colorIndex = tile.colors[pixelX][pixelY];
                if (colorIndex === 0)
                    continue;

                let iX, iY;
                if (!!pieceInfo.XFlip !== !!tileItem.XFlip) {
                    iX = (drawX - pixelX) + (7 - pixelX);
                } else {
                    iX = drawX;
                }
                if (!!pieceInfo.YFlip !== !!tileItem.YFlip) {
                    iY = (drawY - pixelY) + (7 - pixelY);
                } else {
                    iY = drawY;
                }
                let index = ((iY) * (320 + 16 * 2) + (iX));

                let value = palette_[colorPaletteIndex][colorIndex];

                if (tileItem.Priority === false) {
                    lowBuffer[index] = value;
                } else {
                    highBuffer[index] = value;
                }
            }
        }
        this.engine.lowTileCanvas.context.putImageData(this.lowCacheImageData, -17, -17);
        this.engine.highTileCanvas.context.putImageData(this.highCacheImageData, -17, -17);
    }

    private cacheHeightMapForChunk(chunk: TileChunk): CanvasInformation {
        let md = chunk;
        let posj1 = new Point(0, 0);
        let canv = CanvasInformation.create(128, 128, false);
        let ctx = canv.context;
        for (let _y = 0; _y < 8; _y++) {
            for (let _x = 0; _x < 8; _x++) {
                let tp = md.TilePieces[_x][_y];
                let solid = <number>(this.sonicLevel.curHeightMap ? tp.Solid1 : tp.Solid2);
                let hd = this.sonicLevel.curHeightMap ? tp.getLayer1HeightMaps() : tp.getLayer2HeightMaps();
                let __x = _x;
                let __y = _y;
                let vangle = 0;
                let posm = new Point(posj1.x + (__x * 16), posj1.y + (__y * 16));
                if (!hd)
                    continue;
                vangle = this.sonicLevel.curHeightMap ? tp.getLayer1Angles() : tp.getLayer2Angles();
                hd.draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
            }
        }
        return this.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + md.Index] = canv;
    }

    private drawSonic(canvas: CanvasRenderingContext2D): void {
        if (this.currentGameState == GameState.Playing) {
            this.sonicToon.draw(canvas);
        }
    }

    private drawRings(canvas: CanvasRenderingContext2D): void {
        for (let index: number = 0; index < this.sonicLevel.rings.length; index++) {
            let r = this.sonicLevel.rings[index];
            switch (this.currentGameState) {
                case GameState.Playing:
                    if (!this.sonicToon.obtainedRing[index]) {
                        if (this.bigWindowLocation.Intersects(r.x, r.y))
                            this.goodRing.Draw(canvas, (r.x - this.windowLocation.x) | 0, (r.y - this.windowLocation.y ) | 0);
                    }
                    break;
                case GameState.Editing:
                    if (this.bigWindowLocation.Intersects(r.x, r.y))
                        this.goodRing.Draw(canvas, (r.x - this.windowLocation.x) | 0, (r.y - this.windowLocation.y ) | 0);
                    break;
            }
        }
        switch (this.currentGameState) {
            case GameState.Playing:
                for (let i: number = this.activeRings.length - 1; i >= 0; i--) {
                    let ac: Ring = this.activeRings[i];
                    ac.Draw(canvas, ac.x - this.windowLocation.x | 0, ac.y - this.windowLocation.y | 0);
                    if (ac.TickCount > 256)
                        this.activeRings.splice(i, 1);
                }
                break;
            case GameState.Editing:
                break;
        }
    }

    private drawAnimations(canvas: CanvasRenderingContext2D): void {
        for (let ano of this.animationInstances) {
            ano.Draw(canvas, -this.windowLocation.x | 0, -this.windowLocation.y | 0);
        }
    }

    private drawObjects(canvas: CanvasRenderingContext2D): void {
        let levelObjectInfos: LevelObjectInfo[] = this.sonicLevel.objects;
        for (let o of levelObjectInfos) {
            if (o.dead || this.bigWindowLocation.Intersects(o.x, o.y)) {
                o.draw(canvas,
                    ((o.x - this.windowLocation.x)) | 0,
                    ((o.y - this.windowLocation.y)) | 0,
                    this.showHeightMap);
            }
        }
    }

    private containsAnimatedTile(tile: number, sonLevel: SonicLevel): TileAnimationData {
        for (let an of sonLevel.tileAnimations) {
            let anin = an.AnimationTileIndex;
            let num = an.NumberOfTiles;
            if (tile >= anin && tile < anin + num)
                return an;
        }
        return null;
    }

    public clearCache(): void {
        if (this.spriteCache != null)
            this.spriteCache.ClearCache();
        if (this.tilePaletteAnimationManager != null)
            this.tilePaletteAnimationManager.ClearCache();
        if (this.tileAnimationManager != null)
            this.tileAnimationManager.ClearCache();
    }

    public mouseUp(queryEvent: JQueryEventObject): boolean {
        this.clicking = false;
        return false;
    }

    public mouseMove(queryEvent: JQueryEventObject): boolean {
        if (this.clicking)
            if (this.effectClick(queryEvent))
                return true;
        return false;
    }

    public ReplaceMagic(): void {
        this.Replace(new Rectangle(0, 0, 15, 30), new Point(712, 40));
    }

    public Replace(from: Rectangle, to: Point): void {
        for (let y: number = from.Height; y >= 0; y--) {
            let curY: number = y;
            window.setTimeout(() => {
                    for (let x: number = 0; x < from.Width; x++) {
                        let toChunkX = (to.x + x) / 8;
                        let toChunkY = (to.y + curY) / 8;
                        let tochunk = this.sonicLevel.getChunkAt(toChunkX, toChunkY);
                        let totp = tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                        tochunk.checkOnlyForeground();
                        tochunk.checkOnlyBackground();
                        let fromChunkX = (from.x + x) / 8 | 0;
                        let fromChunkY = (from.y + curY) / 8 | 0;
                        let fromchunk = this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                        fromchunk.checkOnlyForeground();
                        fromchunk.checkOnlyBackground();
                        let fromtp = fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8];
                        tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8] = fromtp;
                        fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8] = totp;
                    }
                },
                (from.Height - y) * 50);
        }
    }





    /*load*/
    public cachedObjects: { [key: string]: LevelObject };

    public loadObjects(objects: { key: string, value: string }[]): void {
        this.cachedObjects = {};
        for (var t of this.sonicLevel.objects) {
            let o = t.key;

            if (this.cachedObjects[o]) {
                t.setObjectData(this.cachedObjects[o]);
                continue;
            }
            let d = objects.filter(p => p.key == o)[0];
            if (!d) {
                t.setObjectData(new LevelObject(o));
                continue;
            }
            let dat: LevelObjectData;
            if (d.value.length == 0)
                dat = new LevelObjectData();
            else dat = <LevelObjectData>JSON.parse(d.value);
            let dr = ObjectManager.ExtendObject(dat);
            this.cachedObjects[o] = dr;
            t.setObjectData(dr);

        }

    }

    public downloadObjects(objects: string[]): void {
        $.getJSON('https://api.oursonic.org/objects?object-keys=' + objects.join('~')).then((data) => {
            this.loadObjects(data);
        });
    }

    public load(sonicLevel: SlData): void {
        this.loading = true;
        this.sonicLevel = new SonicLevel();
        for (let n = 0; n < sonicLevel.Rings.length; n++) {
            this.sonicLevel.rings[n] = new Ring(true);
            this.sonicLevel.rings[n].x = sonicLevel.Rings[n].X;
            this.sonicLevel.rings[n].y = sonicLevel.Rings[n].Y;
        }
        this.sonicLevel.levelWidth = sonicLevel.ForegroundWidth;
        this.sonicLevel.levelHeight = sonicLevel.ForegroundHeight;
        this.sonicLevel.chunkMap = sonicLevel.Foreground;
        this.sonicLevel.bgChunkMap = sonicLevel.Background;
        for (let l = 0; l < sonicLevel.Objects.length; l++) {
            this.sonicLevel.objects[l] = new LevelObjectInfo(sonicLevel.Objects[l]);
            this.sonicLevel.objects[l].index = l;
        }
        let objectKeys: string[] = [];
        this.sonicLevel.objects.forEach(t => {
            let o = t.key;
            if (objectKeys.filter(p => p != o).length == objectKeys.length)
                objectKeys.push(o);
        });
        this.downloadObjects(objectKeys);
        for (let j: number = 0; j < sonicLevel.Tiles.length; j++) {
            let fc = sonicLevel.Tiles[j];
            let tiles = fc;
            let mj: number[] = [];
            for (let i: number = 0; i < tiles.length; i++) {
                let value = sonicLevel.Tiles[j][i];
                mj.push((value >> 4));
                mj.push((value & 0xF));
            }
            let mfc = new Array(8);
            for (let o: number = 0; o < 8; o++) {
                mfc[o] = new Array(8);
            }
            for (let n: number = 0; n < mj.length; n++) {
                mfc[n % 8][n / 8 | 0] = mj[n];
            }
            this.sonicLevel.tiles[j] = new Tile(mfc);
            this.sonicLevel.tiles[j].index = j;
        }
        if (sonicLevel.AnimatedFiles) {
            this.sonicLevel.animatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
            for (let animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                let animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                this.sonicLevel.animatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
                for (let filePiece: number = 0; filePiece < animatedFile.length; filePiece++) {
                    let c = animatedFile[filePiece];
                    let tiles = c;
                    let mjc: number[] = [];
                    for (let l: number = 0; l < tiles.length; l++) {
                        let value = animatedFile[filePiece][l];
                        mjc.push((value >> 4));
                        mjc.push((value & 0xF));
                    }
                    let mfc = new Array(8);
                    for (let o: number = 0; o < 8; o++) {
                        mfc[o] = new Array(8);
                    }
                    for (let n: number = 0; n < mjc.length; n++) {
                        mfc[n % 8][n / 8 | 0] = mjc[n];
                    }
                    let tile: Tile = new Tile(mfc);
                    tile.isTileAnimated = true;
                    tile.index = filePiece * 10000 + animatedFileIndex;
                    this.sonicLevel.animatedTileFiles[animatedFileIndex][filePiece] = tile;
                }
            }
        }
        for (let j: number = 0; j < sonicLevel.Blocks.length; j++) {
            let fc = sonicLevel.Blocks[j];
            let mj = new TilePiece();
            mj.Index = j;
            mj.Tiles = [];
            for (let p: number = 0; p < fc.length; p++) {
                mj.Tiles.push(Help.merge(new TileInfo(), {
                    _Tile: fc[p].Tile,
                    Index: p,
                    Palette: fc[p].Palette,
                    Priority: fc[p].Priority,
                    XFlip: fc[p].XFlip,
                    YFlip: fc[p].YFlip
                }));
            }
            mj.Init();
            this.sonicLevel.tilePieces[j] = mj;
        }
        this.sonicLevel.angles = sonicLevel.Angles;
        this.sonicLevel.tileAnimations = sonicLevel.Animations.map(a => Help.merge(new TileAnimationData(), {
            AnimationTileFile: a.AnimationFile,
            AnimationTileIndex: a.AnimationTileIndex,
            AutomatedTiming: a.AutomatedTiming,
            NumberOfTiles: a.NumberOfTiles,
            DataFrames: a.Frames.map(b => Help.merge(new TileAnimationDataFrame(), {
                Ticks: b.Ticks,
                StartingTileIndex: b.StartingTileIndex
            })).slice(0)
        }));
        this.sonicLevel.collisionIndexes1 = sonicLevel.CollisionIndexes1;
        this.sonicLevel.collisionIndexes2 = sonicLevel.CollisionIndexes2;
        for (let i = 0; i < sonicLevel.HeightMaps.length; i++) {
            this.sonicLevel.heightMaps[i] = new HeightMap(sonicLevel.HeightMaps[i], i);
        }
        for (let j: number = 0; j < sonicLevel.Chunks.length; j++) {
            let fc = sonicLevel.Chunks[j];
            let mj = new TileChunk();
            mj.Index = j;
            mj.TilePieces = new Array(8);
            for (let i: number = 0; i < 8; i++) {
                mj.TilePieces[i] = new Array(8);
            }
            for (let p: number = 0; p < fc.length; p++) {
                mj.TilePieces[p % 8][(p / 8) | 0] = Help.merge(new TilePieceInfo(), {
                    Index: p,
                    Block: fc[p].Block,
                    Solid1: fc[p].Solid1,
                    Solid2: fc[p].Solid2,
                    XFlip: fc[p].XFlip,
                    YFlip: fc[p].YFlip
                });
            }
            this.sonicLevel.tileChunks[j] = mj;
            mj.TileAnimations = {};
            for (let tpX: number = 0; tpX < mj.TilePieces.length; tpX++) {
                for (let tpY: number = 0; tpY < mj.TilePieces[tpX].length; tpY++) {
                    let pm = mj.TilePieces[tpX][tpY].getTilePiece();
                    if (pm != null) {
                        for (let mjc of pm.Tiles) {
                            let fa = this.containsAnimatedTile(mjc._Tile, this.sonicLevel);
                            if (fa) {
                                mj.TileAnimations[tpY * 8 + tpX] = fa;
                            }
                        }
                    }
                }
            }
        }
        this.sonicLevel.palette = sonicLevel.Palette.map(a => a.map(col => {
            let r = parseInt(col.slice(0, 2), 16);
            let g = parseInt(col.slice(2, 4), 16);
            let b = parseInt(col.slice(4, 6), 16);

            return (255 << 24) | (b << 16) | (g << 8) | r;
        }));


        this.sonicLevel.startPositions = sonicLevel.StartPositions.map(a => new Point(a.X, a.Y));
        this.sonicLevel.animatedPalettes = [];
        if (sonicLevel.PaletteItems.length > 0) {
            for (let k: number = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                let pal: AnimatedPaletteItem = sonicLevel.PaletteItems[0][k];
                this.sonicLevel.animatedPalettes.push(Help.merge(new PaletteItem(), {
                    Palette: (<string[]>eval(pal.Palette)).map(col => {
                        let r = parseInt(col.slice(0, 2), 16);
                        let g = parseInt(col.slice(2, 4), 16);
                        let b = parseInt(col.slice(4, 6), 16);
                        return (255 << 24) | (b << 16) | (g << 8) | r;
                    }),
                    SkipIndex: pal.SkipIndex,
                    TotalLength: pal.TotalLength,
                    Pieces: pal.Pieces.map(a => Help.merge(new PaletteItemPieces(), {
                        PaletteIndex: a.PaletteIndex,
                        PaletteMultiply: a.PaletteMultiply,
                        PaletteOffset: a.PaletteOffset
                    }))
                }));
            }
        }
        for (let tilePiece of this.sonicLevel.tilePieces) {
            tilePiece.AnimatedPaletteIndexes = [];
            tilePiece.AnimatedTileIndexes = [];
            if (this.sonicLevel.animatedPalettes.length > 0) {
                for (let tileInfo of tilePiece.Tiles) {
                    let tile: Tile = tileInfo.GetTile();
                    if (tile) {
                        let pl = tile.GetAllPaletteIndexes();
                        tile.paletteIndexesToBeAnimated = {};
                        tile.animatedTileIndex = null;
                        for (let tileAnimationIndex = 0; tileAnimationIndex < this.sonicLevel.tileAnimations.length; tileAnimationIndex++) {
                            let tileAnimationData = this.sonicLevel.tileAnimations[tileAnimationIndex];
                            let anin = tileAnimationData.AnimationTileIndex;
                            let num = tileAnimationData.NumberOfTiles;
                            if (tile.index >= anin && tile.index < anin + num) {
                                tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                tile.animatedTileIndex = tileAnimationIndex;
                            }
                        }
                        for (let animatedPaletteIndex = 0; animatedPaletteIndex < this.sonicLevel.animatedPalettes.length; animatedPaletteIndex++) {
                            let animatedPalette = this.sonicLevel.animatedPalettes[animatedPaletteIndex];
                            tile.paletteIndexesToBeAnimated[animatedPaletteIndex] = [];
                            for (let piece of animatedPalette.Pieces) {
                                if (tileInfo.Palette == piece.PaletteIndex) {
                                    if (pl.find(j => j == (piece.PaletteOffset / 2 | 0) || j == (piece.PaletteOffset / 2 | 0) + 1)) {
                                        tilePiece.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                        for (let pIndex of pl) {
                                            if (pIndex == (piece.PaletteOffset / 2 | 0) || pIndex == (piece.PaletteOffset / 2 | 0) + 1) {
                                                tile.paletteIndexesToBeAnimated[animatedPaletteIndex].push(pIndex);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        for (let chunk of this.sonicLevel.tileChunks) {
            chunk.checkEmpty();
            chunk.checkOnlyBackground();
            chunk.checkOnlyForeground();
        }

        let finished = (() => {
            this.loading = false;
        });
        this.preloadSprites(() => {
                finished();
                this.forceResize();
            },
            (s) => {
            });
        this.forceResize();
        this.onLevelLoad && this.onLevelLoad(this.sonicLevel);
    }
}

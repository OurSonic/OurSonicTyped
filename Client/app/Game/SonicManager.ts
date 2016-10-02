import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../common/Utils";
import {CanvasInformation} from "../common/CanvasInformation";
import {SonicEngine} from "./SonicEngine";
import {SonicImage} from "./level/SonicImage";
import {GameState, ClickState, ChunkLayerState} from "../common/Enums";
import {Help} from "../common/Help";
import {Sonic} from "./sonic/Sonic";
import {HeightMap} from "./level/HeightMap";
import {ObjectManager} from "./level/Objects/ObjectManager";
import {SonicLevel, PaletteItem, PaletteItemPieces}from "./SonicLevel";
import {LevelObjectInfo} from "./level/Objects/LevelObjectInfo";
import {Ring} from "./level/Ring";
import {SpriteCache} from "./level/SpriteCache";
import {TileAnimationData, TileAnimationDataFrame} from "./level/Animations/TileAnimationData";
import {AnimationInstance, } from "./level/Animations/AnimationInstance";
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
    public mainCanvas: CanvasInformation;
    private engine: SonicEngine;
    public objectManager: ObjectManager;
    public drawTickCount: number;
    private clicking: boolean;
    private imageLength: number;
    public overrideRealScale: DoublePoint;
    private sonicSprites: { [key: string]: SonicImage } = {};
    public tickCount: number;
    private waitingForDrawContinue: boolean;
    public waitingForTickContinue: boolean;
    private lowChunkCanvas: CanvasInformation;
    private sonicCanvas: CanvasInformation;
    private highChuckCanvas: CanvasInformation;
    public currentGameState: GameState;
    public bigWindowLocation: IntersectingRectangle;
    public sonicToon: Sonic;
    public scale: Point;
    public windowLocation: IntersectingRectangle;
    public realScale: DoublePoint;
    public inHaltMode: boolean;
    public indexedPalette: number;
    public tileAnimations: TileAnimationData[];
    public animationInstances: AnimationInstance[];
    public goodRing: Ring;
    public showHeightMap: boolean;
    public screenOffset: Point;
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
    public tileChunkDebugDrawOptions: TileChunkDebugDrawOptions;
    public tilePaletteAnimationManager: TilePaletteAnimationManager;
    public tileAnimationManager: TileAnimationManager;
    public pixelScale: number = 0;
    private pixelScaleManager: PixelScaleManager = new PixelScaleManager();

    constructor(engine: SonicEngine, gameCanvas: CanvasInformation, resize: () => void) {
        SonicManager.instance = this;
        (<any>window).OurSonic = { SonicManager: { instance: SonicManager.instance}, SonicEngine: engine };
        this.engine = engine;
        this.engine.canvasWidth = $(window).width();
        this.engine.canvasHeight = $(window).height();
        gameCanvas.domCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
        gameCanvas.domCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());

        jQuery.getJSON("assets/content/sprites/sonic.js", (data: { [key: string]: SonicImage }) => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        let scl: number = 2;
        this.scale = new Point(scl, scl);
        this.realScale = new DoublePoint(1, 1);
        this.mainCanvas = gameCanvas;
        this.windowLocation = Help.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation = Help.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation.width = (this.bigWindowLocation.width * 1.8) | 0;
        this.bigWindowLocation.height = (this.bigWindowLocation.height * 1.8) | 0;
        this.tileAnimations = new Array<TileAnimationData>();
        this.animationInstances = new Array<AnimationInstance>();
        this.showHeightMap = false;
        this.goodRing = new Ring(false);
        this.activeRings = new Array<Ring>();
        this.forceResize = resize;
        this.background = null;
        this.currentGameState = GameState.Editing;
        this.screenOffset = new Point(this.mainCanvas.domCanvas.width() / 2 - this.windowLocation.width / 2,
            this.mainCanvas.domCanvas.height() / 2 - this.windowLocation.height / 2);
        this.clickState = ClickState.PlaceChunk;
        this.tickCount = 0;
        this.drawTickCount = 0;
        this.inHaltMode = false;
        this.waitingForTickContinue = false;
        this.waitingForDrawContinue = false;
        this.tileChunkDebugDrawOptions = new TileChunkDebugDrawOptions();
    }

    public onClick(event: JQueryEventObject): boolean {
        this.clicking = true;
        if (this.effectClick(event))
            return true;
        return false;
    }

    private effectClick(event: JQueryEventObject): boolean {
        if(!this.sonicLevel)return;
        let e = new Point((event.clientX / this.scale.x / this.realScale.x + this.windowLocation.x),
            (event.clientY / this.scale.y / this.realScale.y + this.windowLocation.y));
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
                case ClickState.PlaceChunk:
                    {
                        ex = e.x / 128 | 0;
                        ey = e.y / 128 | 0;
                        let ch = this.sonicLevel.getChunkAt(ex, ey);
                        let tp = ch.GetTilePieceAt(e.x - ex * 128, e.y - ey * 128, true);
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
                    this.sonicLevel.rings.push(Help.merge(new Ring(true), { X: ex, Y: ey }));
                    return true;
                case ClickState.PlaceObject:
                    {
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
        let localPoint = new Point(0, 0);
        this.inFocusObjects = [];
        let levelObjectInfos = this.sonicLevel.objects;
        for (let obj of levelObjectInfos) {
            localPoint.x = obj.x | 0;
            localPoint.y = obj.y | 0;
            if (this.bigWindowLocation.Intersects(localPoint)) {
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
        let spriteLocations = new Array<string>();
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
                            ci[i].Context.drawImage(jd, 0, 0);
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
                this.spriteLoader.AddIterationToStep(spriteStep, i);
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
            this.spriteLoader.AddIterationToStep(sonicStep, 0);
        }
    }

    public MainDraw(canvas: CanvasInformation): void {
        let context = canvas.Context;
        if (this.inHaltMode)
            if (this.drawHaltMode(context))
                return;
        this.engine.clear(canvas);
        if (this.sonicLevel == null)
            return;
        context.save();
        let localPoint = new Point(0, 0);
        this.drawTickCount++;
        if (this.spriteLoader && !this.spriteLoader.Tick() || this.loading) {
            SonicManager.drawLoading(context);
            context.restore();
            return;;
        }
        this.updatePositions(context);
        let w1: number = (this.windowLocation.width / 128 | 0) + 2;
        let h1: number = (this.windowLocation.height / 128 | 0) + 2;
        if (this.currentGameState == GameState.Editing) {
            w1 += 1;
            h1 += 1;
            w1 /= this.scale.x;
            h1 /= this.scale.y;
        }
        let offs = SonicManager.getOffs(w1, h1);
        this.tilePaletteAnimationManager.TickAnimatedPalettes();
        this.tileAnimationManager.TickAnimatedTiles();
        let fxP: number = ((this.windowLocation.x) / 128) | 0;
        let fyP: number = ((this.windowLocation.y) / 128) | 0;
        this.ResetCanvases();
        let zero = new Point(0, 0);
        if (this.background) {
            let wOffset: number = this.windowLocation.x;
            let bw: number = this.background.Width;
            let movex: number = (wOffset / bw) * bw;
            localPoint.x = -this.windowLocation.x + movex;
            localPoint.y = -this.windowLocation.y / 4;
            this.background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
            localPoint.x = -this.windowLocation.x + movex + this.background.Width;
            localPoint.y = -this.windowLocation.y / 4;
            this.background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
        }
        this.drawLowChunks(this.lowChunkCanvas.Context, zero, offs, fyP, fxP);
        if (this.showHeightMap)
            this.drawHighChunks(this.lowChunkCanvas.Context, fxP, fyP, offs, zero);
        this.drawObjects(this.sonicCanvas.Context, zero);
        this.drawAnimations(this.sonicCanvas.Context);
        this.drawRings(this.sonicCanvas.Context, zero);
        this.drawSonic(this.sonicCanvas.Context);
        if (!this.showHeightMap)
            this.drawHighChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        this.drawDebugTextChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        //        this.lowChunkCanvas.Context.OffsetPixelsForWater();
        //        this.highChuckCanvas.Context.OffsetPixelsForWater();
        this.drawCanveses(context, localPoint);
        context.restore();
        if (this.currentGameState === GameState.Playing)
            this.sonicToon.drawUI(context, new Point(this.screenOffset.x, this.screenOffset.y));
    }

    private drawCanveses(canvas: CanvasRenderingContext2D, localPoint: Point): void {

        if (this.pixelScale > 0) {
            canvas.drawImage(((this.lowChunkCanvas.canvas)), localPoint.x, localPoint.y);
            canvas.drawImage(((this.sonicCanvas.canvas)), localPoint.x, localPoint.y);
            canvas.drawImage(((this.highChuckCanvas.canvas)), localPoint.x, localPoint.y);

            //this.shadePixels(canvas);


            var imageData = this.pixelScaleManager.scale(canvas, this.pixelScale - 1, this.windowLocation.width, this.windowLocation.height);
            var pixelScale = this.pixelScaleManager.getPixelScale(this.pixelScale - 1);
            canvas.scale(pixelScale.x, pixelScale.y);


            canvas.scale(this.realScale.x, this.realScale.y);
            canvas.scale(this.scale.x, this.scale.y);

            canvas.drawImage(imageData, localPoint.x, localPoint.y);
        } else {
            canvas.scale(this.realScale.x, this.realScale.y);
            canvas.scale(this.scale.x, this.scale.y);
            //this.shadePixels(canvas);
            canvas.drawImage(((this.lowChunkCanvas.canvas)), localPoint.x, localPoint.y);
            canvas.drawImage(((this.sonicCanvas.canvas)), localPoint.x, localPoint.y);
            canvas.drawImage(((this.highChuckCanvas.canvas)), localPoint.x, localPoint.y);

        }
    }

    private shadePixels(canvas: CanvasRenderingContext2D) {
        var img = canvas.getImageData(0, 0, this.windowLocation.width, this.windowLocation.height);
        var arr = img.data;

        var newArr = PixelScaleManager.cachedArray(this.windowLocation.width * this.windowLocation.height);
        for (var i = 0; i < arr.length; i += 4) {
            this.transform(arr, newArr, i, this.windowLocation.width, this.windowLocation.height);
        }
        img.data.set(newArr);
        canvas.putImageData(img, 0, 0);
    }

    transform(arr: Uint8ClampedArray, arr2: Uint8ClampedArray, i: number, width: number, height: number) {

        var x = i / 4 % width | 0;
        var y = i / 4 / width | 0;

        var top = PixelScaleManager._top(x - 1, y, width, height);
        var bottom = PixelScaleManager._bottom(x + 1, y, width, height);

        arr2[i] = 127;
        arr2[i + 1] = 127;
        arr2[i + 2] = 127;

        arr2[i] -= arr[top];
        arr2[i + 1] -= arr[top + 1];
        arr2[i + 2] -= arr[top + 2];


        arr2[i] += arr[bottom];
        arr2[i + 1] += arr[bottom + 1];
        arr2[i + 2] += arr[bottom + 2];

        var m = (arr2[i] + arr2[i + 1] + arr2[i + 2]) / 3 | 0;
        arr2[i] = m;
        arr2[i + 1] = m;
        arr2[i + 2] = m;


    }

    public ResetCanvases(): void {
        this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation.create(this.windowLocation.width, this.windowLocation.height, false);
        this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation.create(this.windowLocation.width, this.windowLocation.height, true);
        this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation.create(this.windowLocation.width, this.windowLocation.height, false);
        this.sonicCanvas.Context.clearRect(0, 0, this.windowLocation.width, this.windowLocation.height);
        this.highChuckCanvas.Context.clearRect(0, 0, this.windowLocation.width, this.windowLocation.height);
        this.lowChunkCanvas.Context.clearRect(0, 0, this.windowLocation.width, this.windowLocation.height);
    }

    public DestroyCanvases(): void {
        this.lowChunkCanvas = null;
        this.sonicCanvas = null;
        this.highChuckCanvas = null;
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

    private updatePositions(canvas: CanvasRenderingContext2D): void {
        this.screenOffset.x = 0;
        this.screenOffset.y = 0;
        if (this.currentGameState == GameState.Playing)
            this.updatePositionsForPlaying(canvas);
    }

    private updatePositionsForPlaying(canvas: CanvasRenderingContext2D): void {
        // canvas.scale(this.realScale.x, this.realScale.y);
        if (this.sonicToon.ticking) {
            while (true) {
                if (this.sonicToon.ticking)
                    break;
            }
        }
        canvas.translate(this.screenOffset.x, this.screenOffset.y);
        this.windowLocation.x = <number>(this.sonicToon.x) - this.windowLocation.width / 2;
        this.windowLocation.y = <number>(this.sonicToon.y) - this.windowLocation.height / 2;
        this.bigWindowLocation.x = <number>(this.sonicToon.x) - this.bigWindowLocation.width / 2;
        this.bigWindowLocation.y = <number>(this.sonicToon.y) - this.bigWindowLocation.height / 2;
        this.bigWindowLocation.x = <number>(this.bigWindowLocation.x - this.windowLocation.width * 0.2);
        this.bigWindowLocation.y = <number>(this.bigWindowLocation.y - this.windowLocation.height * 0.2);
        this.bigWindowLocation.width = <number>(this.windowLocation.width * 1.8);
        this.bigWindowLocation.height = <number>(this.windowLocation.height * 1.8);
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

    private drawLowChunks(canvas: CanvasRenderingContext2D, localPoint: Point, offs: Point[], fyP: number, fxP: number): void {
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
            localPoint.x = (_xPreal * 128) - this.windowLocation.x | 0;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y | 0;
            if (!chunk.isEmpty() && !chunk.OnlyForeground())
                chunk.draw(canvas, localPoint, ChunkLayerState.Low);
        }
    }

    private drawHighChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
        var m = [];

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
            localPoint.x = (_xPreal * 128) - this.windowLocation.x | 0;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y | 0;
            if (!chunk.isEmpty() && !chunk.onlyBackground()) {

                m.push(localPoint.x + " " + localPoint.y);
                chunk.draw(canvas, localPoint, ChunkLayerState.High);
            }
            if (this.showHeightMap) {
                let fd = this.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + chunk.Index];
                if (fd == null) {
                    fd = this.cacheHeightMapForChunk(chunk);
                }
                canvas.drawImage(fd.canvas, localPoint.x, localPoint.y);
            }
            if (this.currentGameState == GameState.Editing) {
                canvas.strokeStyle = "#DD0033";
                canvas.lineWidth = 3;
                canvas.strokeRect(localPoint.x, localPoint.y, 128, 128);
            }
        }
    }

    private drawDebugTextChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
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
            localPoint.x = (_xPreal * 128) - this.windowLocation.x;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y;
            if (!chunk.isEmpty() && !chunk.OnlyForeground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayerState.Low, this.tileChunkDebugDrawOptions);
            if (!chunk.isEmpty() && !chunk.onlyBackground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayerState.High, this.tileChunkDebugDrawOptions);
        }
    }

    private cacheHeightMapForChunk(chunk: TileChunk): CanvasInformation {
        let md = chunk;
        let posj1 = new Point(0, 0);
        let canv = CanvasInformation.create(128, 128, false);
        let ctx = canv.Context;
        this.engine.clear(canv);
        for (let _y = 0; _y < 8; _y++) {
            for (let _x = 0; _x < 8; _x++) {
                let tp = md.TilePieces[_x][_y];
                let solid = <number>(this.sonicLevel.curHeightMap ? tp.Solid1 : tp.Solid2);
                let hd = this.sonicLevel.curHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
                let __x = _x;
                let __y = _y;
                let vangle = 0;
                let posm = new Point(posj1.x + (__x * 16), posj1.y + (__y * 16));
                if (!hd)
                    continue;
                if (hd.Full === false) {

                }
                else if (hd.Full === true) {
                    if (solid > 0) {
                        ctx.fillStyle = HeightMap.colors[solid];
                        ctx.fillRect(posj1.x + (__x * 16),
                            posj1.y + (__y * 16),
                            16,
                            16);
                    }
                }
                else {
                    vangle = this.sonicLevel.curHeightMap ? tp.GetLayer1Angles() : tp.GetLayer2Angles();
                    hd.Draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
                }
            }
        }
        return this.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + md.Index] = canv;
    }

    private drawSonic(canvas: CanvasRenderingContext2D): void {
        if (this.currentGameState == GameState.Playing) {
            this.sonicToon.draw(canvas);
        }
    }

    private drawRings(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        for (let index: number = 0; index < this.sonicLevel.rings.length; index++) {
            let r = this.sonicLevel.rings[index];
            switch (this.currentGameState) {
                case GameState.Playing:
                    if (!this.sonicToon.obtainedRing[index]) {
                        if (this.bigWindowLocation.Intersects(r))
                            this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x | 0, this.windowLocation.y | 0));
                    }
                    break;
                case GameState.Editing:
                    if (this.bigWindowLocation.Intersects(r))
                        this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x | 0, this.windowLocation.y | 0));
                    break;
            }
        }
        switch (this.currentGameState) {
            case GameState.Playing:
                for (let i: number = this.activeRings.length - 1; i >= 0; i--) {
                    let ac: Ring = this.activeRings[i];
                    localPoint.x = ac.x - this.windowLocation.x | 0;
                    localPoint.y = ac.y - this.windowLocation.y | 0;
                    ac.Draw(canvas, localPoint);
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

    private drawObjects(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        let levelObjectInfos: LevelObjectInfo[] = this.sonicLevel.objects;
        for (let o of levelObjectInfos) {
            localPoint.x = o.x;
            localPoint.y = o.y;
            if (o.dead || this.bigWindowLocation.Intersects(localPoint)) {
                o.draw(canvas,
                    ((localPoint.x - this.windowLocation.x)) | 0,
                    ((localPoint.y - this.windowLocation.y)) | 0,
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
        if (this.sonicLevel != null)
            this.sonicLevel.clearCache();
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
                    tochunk.clearCache();
                    let totp = tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                    tochunk.IsOnlyBackground = null;
                    tochunk.IsOnlyForeground = null;
                    let fromChunkX = (from.x + x) / 8 | 0;
                    let fromChunkY = (from.y + curY) / 8 | 0;
                    let fromchunk = this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                    fromchunk.clearCache();
                    fromchunk.IsOnlyBackground = null;
                    fromchunk.IsOnlyForeground = null;
                    let fromtp = fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8];
                    tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8] = fromtp;
                    fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8] = totp;
                }
            },
                (from.Height - y) * 50);
        }
    }

    public cacheTiles(): void {
        console.time("tileCache");
        this.tilePaletteAnimationManager = new TilePaletteAnimationManager(this);
        this.tileAnimationManager = new TileAnimationManager(this);
        for (let chunk of this.sonicLevel.tileChunks) {
            chunk.initCache();
            chunk.warmCache();
        }
        console.timeEnd("tileCache");
        if (this.sonicToon != null) {
            console.time("collisionCache");
            for (let chunk of this.sonicLevel.tileChunks) {
                this.sonicToon.sensorManager.buildChunk(chunk, false);
                this.sonicToon.sensorManager.buildChunk(chunk, true);
            }
            console.timeEnd("collisionCache");
        }
        //this.debugDraw();
    }

    private debugDraw(): void {
        let numWide: number = 10;
        let dropOffIndex: number = 0;
        let pieces: string[] = new Array<string>();
        while (true) {
            let debugCanvases: CanvasInformation[] = new Array<CanvasInformation>();
            let totalHeight: number = 0;
            let broke = false;
            for (let index: number = dropOffIndex; index < this.sonicLevel.tileChunks.length; index++) {
                let chunk = this.sonicLevel.tileChunks[index];
                let canvasCache = chunk.Debug_DrawCache();
                totalHeight += canvasCache.canvas.height;
                debugCanvases.push(canvasCache);
                if (totalHeight > 10000) {
                    dropOffIndex = index + 1;
                    broke = true;
                    break;
                }
            }
            let bigOne = CanvasInformation.create(numWide * 128, totalHeight, false);
            let currentPosition: number = 0;
            for (let index: number = 0; index < debugCanvases.length; index++) {
                let canvasInformation = debugCanvases[index];
                bigOne.Context.drawImage(canvasInformation.canvas, 0, currentPosition);
                currentPosition += canvasInformation.canvas.height;
            }
            pieces.push(bigOne.canvas.toDataURL());
            if (!broke)
                break;
        }
        let str = "<html><body>";
        for (let piece of pieces) {
            str += "<img src=\"" + piece + "\"/>\n";
        }
        str += "</body></html>";
        let tx = document.createElement("textarea");
        tx.style.position = "absolute";
        tx.value = str;
        document.body.appendChild(tx);
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
            console.log(data);
            this.loadObjects(data);
        });
    }

    public Load(sonicLevel: SlData): void {
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
        for (let l: number = 0; l < sonicLevel.Objects.length; l++) {
            this.sonicLevel.objects[l] = new LevelObjectInfo(sonicLevel.Objects[l]);
            this.sonicLevel.objects[l].index = l;
        }
        let objectKeys = new Array<string>();
        this.sonicLevel.objects.forEach(t => {
            let o = t.key;
            if (objectKeys.filter(p => p != o).length == objectKeys.length)
                objectKeys.push(o);
        });
        this.downloadObjects(objectKeys);
        for (let j: number = 0; j < sonicLevel.Tiles.length; j++) {
            let fc = sonicLevel.Tiles[j];
            let tiles = fc;
            let mj: number[] = new Array<number>();
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
        let acs = this.sonicLevel.animatedChunks = new Array<TileChunk>();
        if (sonicLevel.AnimatedFiles) {
            this.sonicLevel.animatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
            for (let animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                let animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                this.sonicLevel.animatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
                for (let filePiece: number = 0; filePiece < animatedFile.length; filePiece++) {
                    let c = animatedFile[filePiece];
                    let tiles = c;
                    let mjc: number[] = new Array<number>();
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
            mj.Tiles = new Array<TileInfo>();
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
        for (let i: number = 0; i < sonicLevel.HeightMaps.length; i++) {
            let b1 = true;
            let b2 = true;
            for (let m: number = 0; m < sonicLevel.HeightMaps[i].length; m++) {
                if (b1 && sonicLevel.HeightMaps[i][m] !== 0)
                    b1 = false;
                if (b2 && sonicLevel.HeightMaps[i][m] !== 16)
                    b2 = false;
            }
            if (b1)
                this.sonicLevel.heightMaps[i] = HeightMap.FullHeight(false);
            else if (b2)
                this.sonicLevel.heightMaps[i] = HeightMap.FullHeight(true);
            else this.sonicLevel.heightMaps[i] = new HeightMap(sonicLevel.HeightMaps[i], i);
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
                    let pm = mj.TilePieces[tpX][tpY].GetTilePiece();
                    if (pm != null) {
                        for (let mjc of pm.Tiles) {
                            let fa = this.containsAnimatedTile(mjc._Tile, this.sonicLevel);
                            if (fa) {
                                mj.TileAnimations[tpY * 8 + tpX] = fa;
                                acs[j] = mj;
                            }
                        }
                    }
                }
            }
        }
        this.sonicLevel.palette = sonicLevel.Palette.map(a => a.map(b => "#" + b));
        this.sonicLevel.startPositions = sonicLevel.StartPositions.map(a => new Point(a.X, a.Y));
        this.sonicLevel.animatedPalettes = new Array<PaletteItem>();
        if (sonicLevel.PaletteItems.length > 0) {
            for (let k: number = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                let pal: AnimatedPaletteItem = sonicLevel.PaletteItems[0][k];
                this.sonicLevel.animatedPalettes.push(Help.merge(new PaletteItem(), {
                    Palette: (<string[]>eval(pal.Palette)).map(b => "#" + b),
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
            tilePiece.AnimatedPaletteIndexes = new Array<number>();
            tilePiece.AnimatedTileIndexes = new Array<number>();
            if (this.sonicLevel.animatedPalettes.length > 0) {
                for (let mj of tilePiece.Tiles) {
                    let tile: Tile = mj.GetTile();
                    if (tile) {
                        tile.animatedPaletteIndexes = new Array<number>();
                        let pl = tile.GetAllPaletteIndexes();
                        tile.paletteIndexesToBeAnimated = {};
                        tile.animatedTileIndexes = new Array<number>();
                        for (let tileAnimationIndex: number = 0; tileAnimationIndex < this.sonicLevel.tileAnimations.length; tileAnimationIndex++) {
                            let tileAnimationData = this.sonicLevel.tileAnimations[tileAnimationIndex];
                            let anin = tileAnimationData.AnimationTileIndex;
                            let num = tileAnimationData.NumberOfTiles;
                            if (tile.index >= anin && tile.index < anin + num) {
                                tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                tile.animatedTileIndexes.push(tileAnimationIndex);
                            }
                        }
                        for (let animatedPaletteIndex: number = 0; animatedPaletteIndex < this.sonicLevel.animatedPalettes.length; animatedPaletteIndex++) {
                            let pal = this.sonicLevel.animatedPalettes[animatedPaletteIndex];
                            tile.paletteIndexesToBeAnimated[animatedPaletteIndex] = new Array<number>();
                            for (let mjce of pal.Pieces) {
                                let mje1: PaletteItemPieces = mjce;
                                if (mj.Palette == mje1.PaletteIndex) {
                                    if (pl.filter(j => j == (mje1.PaletteOffset / 2 | 0) || j == (mje1.PaletteOffset / 2 | 0) + 1).length > 0) {
                                        tilePiece.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                        tile.animatedPaletteIndexes.push(animatedPaletteIndex);
                                        for (let pIndex of pl) {
                                            if (pIndex == (mje1.PaletteOffset / 2 | 0) || pIndex == (mje1.PaletteOffset / 2 | 0) + 1) {
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


class PixelScaleManager {

    private cachedImageDatas = {};
    private cachedCanvases = {};
    private static cachedArrays = {};
    private cached32BitArrays = {};
    private cachedPosLookups = {};


    scale(context: CanvasRenderingContext2D, pixelScale: number, width: number, height: number): HTMLCanvasElement {
        if (pixelScale == 0) return context.canvas;
        var startingPixelScale = pixelScale;

        var imageData = context.getImageData(0, 0, width, height).data;
        while (pixelScale > 0) {
            var nScale = Math.pow(2, (startingPixelScale - pixelScale));
            imageData = this.scaleIt(imageData, width * nScale, height * nScale);
            pixelScale--;
        }
        var f = Math.pow(2, startingPixelScale);
        var largeImageData = this.cachedImageData(context, width * f, height * f);
        largeImageData.data.set(imageData);

        var newC = this.cachedCanvas(largeImageData.width, largeImageData.height);
        newC.context.putImageData(largeImageData, 0, 0);
        return newC.canvas;
    }

    getPixelScale(pixelScale) {
        var nScale = Math.pow(2, pixelScale);
        return { x: 1 / nScale, y: 1 / nScale };
    }


    private scaleIt(pixels_, width, height) {

        var width2 = width * 2;
        var height2 = height * 2;
        var pixels2_ = PixelScaleManager.cachedArray(width2 * height2);
        var posLookup = this.getPosLookup(width, height);
        var colsLookup = this.getColsLookup(pixels_, width, height);


        var cc = 0;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {


                var Bid = posLookup.top[cc];
                var Did = posLookup.left[cc];
                var Eid = posLookup.middle[cc];
                var Fid = posLookup.right[cc];
                var Hid = posLookup.bottom[cc];


                cc++;


                /*
                 var B = (((pixels_[Bid] << 8) + pixels_[Bid + 1]) << 8) + pixels_[Bid + 2];
                 var D = (((pixels_[Did] << 8) + pixels_[Did + 1]) << 8) + pixels_[Did + 2];
                 var F = (((pixels_[Fid] << 8) + pixels_[Fid + 1]) << 8) + pixels_[Fid + 2];
                 var H = (((pixels_[Hid] << 8) + pixels_[Hid + 1]) << 8) + pixels_[Hid + 2];
                 */

                var B = colsLookup[Bid];
                var D = colsLookup[Did];
                var F = colsLookup[Fid];
                var H = colsLookup[Hid];

                var E0, E1, E2, E3;
                if (B !== (H) && D !== (F)) {
                    E0 = D == (B) ? Did : Eid;
                    E1 = B == (F) ? Fid : Eid;
                    E2 = D == (H) ? Did : Eid;
                    E3 = H == (F) ? Fid : Eid;
                } else {
                    E0 = Eid;
                    E1 = Eid;
                    E2 = Eid;
                    E3 = Eid;
                }


                var tl = (((y * 2) * width2 + (x * 2)) * 4);
                var tr = (((y * 2) * width2 + (x * 2 + 1)) * 4);
                var bl = (((y * 2 + 1) * width2 + (x * 2)) * 4);
                var br = (((y * 2 + 1) * width2 + (x * 2 + 1)) * 4);


                pixels2_[tl] = pixels_[E0];
                pixels2_[tr] = pixels_[E1];
                pixels2_[bl] = pixels_[E2];
                pixels2_[br] = pixels_[E3];


                pixels2_[tl + 1] = pixels_[E0 + 1];
                pixels2_[tr + 1] = pixels_[E1 + 1];
                pixels2_[bl + 1] = pixels_[E2 + 1];
                pixels2_[br + 1] = pixels_[E3 + 1];


                pixels2_[tl + 2] = pixels_[E0 + 2];
                pixels2_[tr + 2] = pixels_[E1 + 2];
                pixels2_[bl + 2] = pixels_[E2 + 2];
                pixels2_[br + 2] = pixels_[E3 + 2];


            }
        }
        return pixels2_;
    }


    private getPosLookup(width, height) {
        var posLookup = this.cachedPosLookups[width * height];
        if (posLookup) return posLookup;

        posLookup = this.cachedPosLookups[width * height] = {
            left: new Uint32Array(width * height),
            right: new Uint32Array(width * height),
            top: new Uint32Array(width * height),
            bottom: new Uint32Array(width * height),
            middle: new Uint32Array(width * height)
        };
        var cc = 0;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {


                posLookup.top[cc] = PixelScaleManager._top(x, y, width, height);
                posLookup.left[cc] = PixelScaleManager._left(x, y, width, height);
                posLookup.middle[cc] = ((y) * width + (x)) * 4;
                posLookup.right[cc] = PixelScaleManager._right(x, y, width, height);
                posLookup.bottom[cc] = PixelScaleManager._bottom(x, y, width, height);


                cc++;

            }
        }
        return posLookup
    }


    private getColsLookup(imageData, width, height) {
        var cols = this.cached32BitArray(width * height * 4);
        var pixels_ = imageData;
        var cc = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                cols[cc] = (((pixels_[(y * width + x) * 4] << 8) + pixels_[(y * width + x) * 4 + 1]) << 8) + pixels_[(y * width + x) * 4 + 2];
                cc += 4;
            }
        }
        return cols
    }


    public static _top(x, y, width, height) {
        if (y <= 0)
            return ((y) * width + (x)) * 4;
        else
            return ((y - 1) * width + (x)) * 4;
    }

    public static _left(x, y, width, height) {
        if (x <= 0)
            return ((y) * width + (x)) * 4;
        else
            return ((y) * width + (x - 1)) * 4;
    }

    public static _right(x, y, width, height) {
        if (x + 1 >= width)
            return ((y) * width + (x)) * 4;
        else
            return ((y) * width + (x + 1)) * 4;
    }

    public static _bottom(x, y, width, height) {
        if (y + 1 >= height)
            return ((y) * width + (x)) * 4;
        else
            return ((y + 1) * width + (x)) * 4;
    }


    public cachedImageData(canvas, width, height) {
        var s = ((width) + " " + (height));
        if (this.cachedImageDatas[s]) {
            return this.cachedImageDatas[s];
        }
        return this.cachedImageDatas[s] = canvas.createImageData(width, height);
    };

    private cachedCanvas(width, height) {

        var s = (width + " " + height);
        var tempCnv = this.cachedCanvases[s];
        if (tempCnv) {
            return tempCnv;
        }

        var newCanvas = document.createElement('canvas');
        newCanvas.width = width;
        newCanvas.height = height;
        var newContext = newCanvas.getContext('2d');
        (<any>newContext).mozImageSmoothingEnabled = false; /// future
        (<any>newContext).msImageSmoothingEnabled = false; /// future
        (<any>newContext).imageSmoothingEnabled = false; /// future

        return this.cachedCanvases[s] = {
            canvas: newCanvas,
            context: newContext
        };
    }

    static cachedArray(size) {
        var tmp = PixelScaleManager.cachedArrays[size];
        if (tmp) {
            return tmp;
        }
        tmp = PixelScaleManager.cachedArrays[size] = new Uint8ClampedArray(size * 4);

        for (var s = 0; s < size * 4; s++) {
            tmp[s] = 255;
        }

        return tmp;
    }

    private cached32BitArray(size) {
        var tmp = this.cached32BitArrays[size];
        if (tmp) {
            return tmp;
        }
        return this.cached32BitArrays[size] = new Uint32Array(size);
    }

}
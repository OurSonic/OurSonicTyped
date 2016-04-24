import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../Common/Utils";
import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicEngine} from "./SonicEngine";
import {SonicImage} from "./Level/SonicImage";
import {GameState, ClickState, ChunkLayerState} from "../Common/Enums";
import {Help} from "../Common/Help";
import {Sonic} from "./Sonic/Sonic";
import {HeightMap} from "./Level/HeightMap";
import {ObjectManager} from "./Level/Objects/ObjectManager";
import {SonicLevel, PaletteItem, PaletteItemPieces}from "./SonicLevel";
import {LevelObjectInfo} from "./Level/Objects/LevelObjectInfo";
import {Ring} from "./Level/Ring";
import {SpriteCache} from "./Level/SpriteCache";
import {TileAnimationData, TileAnimationDataFrame} from "./Level/Animations/TileAnimationData";
import {AnimationInstance,} from "./Level/Animations/AnimationInstance";
import {TilePaletteAnimationManager} from "./Level/Tiles/TilePaletteAnimationManager";
import {TileAnimationManager} from "./Level/Tiles/TileAnimationManager";
import {TileChunkDebugDrawOptions, TileChunk} from "./Level/Tiles/TileChunk";
import {SpriteLoader} from "../Common/SpriteLoader";
import {SonicBackground} from "./Level/SonicBackground";
import {LevelObject} from "./Level/Objects/LevelObject";
import {LevelObjectData} from "./Level/Objects/LevelObjectData";
import {SLData as SlData, AnimatedPaletteItem} from "../SLData";
import {Tile} from "./Level/Tiles/Tile";
import {TilePiece} from "./Level/Tiles/TilePiece";
import {TileInfo} from "./Level/Tiles/TileInfo";
import {TilePieceInfo} from "./Level/Tiles/TilePieceInfo";

export class SonicManager {
    public static instance:SonicManager;
    private static _cachedOffs:{ [key:number]:Point[] } = {};
    public mainCanvas:CanvasInformation;
    private engine:SonicEngine;
    public objectManager:ObjectManager;
    public drawTickCount:number;
    private clicking:boolean;
    private imageLength:number;
    public overrideRealScale:DoublePoint;
    private sonicSprites:{ [key:string]:SonicImage } = {};
    public tickCount:number;
    private waitingForDrawContinue:boolean;
    public waitingForTickContinue:boolean;
    private lowChunkCanvas:CanvasInformation;
    private sonicCanvas:CanvasInformation;
    private highChuckCanvas:CanvasInformation;
    public currentGameState:GameState;
    public bigWindowLocation:IntersectingRectangle;
    public sonicToon:Sonic;
    public scale:Point;
    public windowLocation:IntersectingRectangle;
    public realScale:DoublePoint;
    public inHaltMode:boolean;
    public indexedPalette:number;
    public tileAnimations:TileAnimationData[];
    public animationInstances:AnimationInstance[];
    public goodRing:Ring;
    public showHeightMap:boolean;
    public screenOffset:Point;
    public activeRings:Ring[];
    public forceResize:() => void;
    public background:SonicBackground;
    public clickState:ClickState;
    public sonicLevel:SonicLevel;
    public inFocusObjects:LevelObjectInfo[];
    protected loading:boolean;
    public spriteCache:SpriteCache;
    protected spriteLoader:SpriteLoader;
    public onLevelLoad:(_:SonicLevel) => void;
    public tileChunkDebugDrawOptions:TileChunkDebugDrawOptions;
    public tilePaletteAnimationManager:TilePaletteAnimationManager;
    public tileAnimationManager:TileAnimationManager;

    constructor(engine:SonicEngine, gameCanvas:CanvasInformation, resize:() => void) {
        SonicManager.instance = this;
        this.engine = engine;
        this.engine.canvasWidth = $(window).width();
        this.engine.canvasHeight = $(window).height();
        gameCanvas.domCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
        gameCanvas.domCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
        jQuery.getJSON("content/sprites/sonic.js", (data:{ [key:string]:SonicImage }) => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        let scl:number = 4;
        this.scale = new Point(scl, scl);
        this.realScale = new DoublePoint(1, 1);
        this.mainCanvas = gameCanvas;
        this.windowLocation = Help.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation = Help.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation.Width = (this.bigWindowLocation.Width * 1.8) | 0;
        this.bigWindowLocation.Height = (this.bigWindowLocation.Height * 1.8) | 0;
        this.tileAnimations = new Array<TileAnimationData>();
        this.animationInstances = new Array<AnimationInstance>();
        this.showHeightMap = false;
        this.goodRing = new Ring(false);
        this.activeRings = new Array<Ring>();
        this.forceResize = resize;
        this.background = null;
        this.currentGameState = GameState.Editing;
        this.screenOffset = new Point(this.mainCanvas.domCanvas.width() / 2 - this.windowLocation.Width / 2,
            this.mainCanvas.domCanvas.height() / 2 - this.windowLocation.Height / 2);
        this.clickState = ClickState.PlaceChunk;
        this.tickCount = 0;
        this.drawTickCount = 0;
        this.inHaltMode = false;
        this.waitingForTickContinue = false;
        this.waitingForDrawContinue = false;
        this.tileChunkDebugDrawOptions = new TileChunkDebugDrawOptions();
    }

    public OnClick(Event:JQueryEventObject):boolean {
        this.clicking = true;
        if (this.effectClick(Event))
            return true;
        return false;
    }

    private effectClick(event:JQueryEventObject):boolean {
        let e = new Point(<number>(<number>event.clientX / this.scale.x / this.realScale.x + this.windowLocation.x),
            <number>(<number>event.clientY / this.scale.y / this.realScale.y + this.windowLocation.y));
        let ey:number;
        let ex:number;
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
        if (event.button == 0) {
            switch (this.clickState) {
                case ClickState.Dragging:
                    return true;
                case ClickState.PlaceChunk:
                    ex = e.x / 128 | 0;
                    ey = e.y / 128 | 0;
                    let ch = this.sonicLevel.getChunkAt(ex, ey);
                    let tp = ch.GetTilePieceAt(e.x - ex * 128, e.y - ey * 128, true);
                    let dontClear:boolean = false;
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
                    this.clearCache();
                    return true;
                case ClickState.PlaceRing:
                    ex = e.x;
                    ey = e.y;
                    this.sonicLevel.Rings.push(Help.merge(new Ring(true), {X: ex, Y: ey}));
                    return true;
                case ClickState.PlaceObject:
                    ex = e.x;
                    ey = e.y;
                    let pos = new Point(ex, ey);
                    for (let o of this.sonicLevel.Objects) {
                        if (IntersectingRectangle.IntersectsRect(o.GetRect(), pos))
                            alert("Object Data: " + Help.stringify(o));
                    }
                    return true;
            }
        }
        return false;
    }

    private tickObjects():void {
        let localPoint = new Point(0, 0);
        this.inFocusObjects = new Array<LevelObjectInfo>();
        let levelObjectInfos = this.sonicLevel.Objects;
        for (let obj of levelObjectInfos) {
            localPoint.x = obj.X | 0;
            localPoint.y = obj.Y | 0;
            if (this.bigWindowLocation.Intersects(localPoint)) {
                this.inFocusObjects.push(obj);
                obj.Tick(obj, this.sonicLevel, this.sonicToon);
            }
        }
        //        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
        //            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
        for (let animationInstance of this.animationInstances) {
            animationInstance.Tick();
        }
    }

    public Tick():void {
        if (this.loading)
            return
        if (this.currentGameState == GameState.Playing) {
            if (this.inHaltMode) {
                if (this.waitingForTickContinue)
                    return
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
                    return
                this.waitingForTickContinue = true;
                this.waitingForDrawContinue = false;
            }
        }
    }

    public PreloadSprites(completed:() => void, update:(_:string) => void):void {
        if (this.spriteCache != null) {
            completed();
            return
        }
        this.spriteCache = this.spriteCache != null ? this.spriteCache : new SpriteCache();
        let ci = this.spriteCache.Rings;
        let spriteLocations = new Array<string>();
        for (let j:number = 0; j < 4; j++) {
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

    public MainDraw(canvas:CanvasInformation):void {
        let context = canvas.Context;
        if (this.inHaltMode)
            if (this.drawHaltMode(context))
                return
        this.engine.Clear(canvas);
        if (this.sonicLevel == null)
            return
        context.save();
        let localPoint = new Point(0, 0);
        this.drawTickCount++;
        if (this.spriteLoader && !this.spriteLoader.Tick() || this.loading) {
            SonicManager.drawLoading(context);
            context.restore();
            return;
        }
        this.updatePositions(context);
        let w1:number = this.windowLocation.Width / 128 + 2;
        let h1:number = this.windowLocation.Height / 128 + 2;
        if (this.currentGameState == GameState.Editing) {
            w1 += 1;
            h1 += 1;
            w1 /= this.scale.x;
            h1 /= this.scale.y;
        }
        let offs = SonicManager.getOffs(w1, h1);
        this.tilePaletteAnimationManager.TickAnimatedPalettes();
        this.tileAnimationManager.TickAnimatedTiles();
        let fxP:number = ((this.windowLocation.x) / 128) | 0;
        let fyP:number = ((this.windowLocation.y) / 128) | 0;
        this.ResetCanvases();
        let zero = new Point(0, 0);
        if (this.background) {
            let wOffset:number = this.windowLocation.x;
            let bw:number = this.background.Width;
            let movex:number = (wOffset / bw) * bw;
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
        if (this.currentGameState == GameState.Playing)
            this.sonicToon.DrawUI(context, new Point(this.screenOffset.x, this.screenOffset.y));
    }

    private drawCanveses(canvas:CanvasRenderingContext2D, localPoint:Point):void {
        canvas.scale(this.scale.x, this.scale.y);
        canvas.drawImage(this.lowChunkCanvas.canvas, localPoint.x, localPoint.y);
        canvas.drawImage(this.sonicCanvas.canvas, localPoint.x, localPoint.y);
        canvas.drawImage(this.highChuckCanvas.canvas, localPoint.x, localPoint.y);
    }

    public ResetCanvases():void {
        this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation.create(this.windowLocation.Width, this.windowLocation.Height, false);
        this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation.create(this.windowLocation.Width, this.windowLocation.Height, true);
        this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation.create(this.windowLocation.Width, this.windowLocation.Height, false);
        this.sonicCanvas.Context.clearRect(0, 0, this.windowLocation.Width, this.windowLocation.Height);
        this.highChuckCanvas.Context.clearRect(0, 0, this.windowLocation.Width, this.windowLocation.Height);
        this.lowChunkCanvas.Context.clearRect(0, 0, this.windowLocation.Width, this.windowLocation.Height);
    }

    public DestroyCanvases():void {
        this.lowChunkCanvas = null;
        this.sonicCanvas = null;
        this.highChuckCanvas = null;
    }

    private static getOffs(w1:number, h1:number):Point[] {
        let hash:number = (w1 + 1) * (h1 + 1);
        if (SonicManager._cachedOffs[hash])
            return SonicManager._cachedOffs[hash];
        let offs = new Array(0);
        let ca = 0;
        for (let y:number = -1; y < h1; y++)
            for (let x:number = -1; x < w1; x++)
                offs[ca++] = (new Point(x, y));
        return SonicManager._cachedOffs[hash] = offs;
    }

    private updatePositions(canvas:CanvasRenderingContext2D):void {
        this.screenOffset.x = 0;
        this.screenOffset.y = 0;
        if (this.currentGameState == GameState.Playing)
            this.updatePositionsForPlaying(canvas);
    }

    private updatePositionsForPlaying(canvas:CanvasRenderingContext2D):void {
        canvas.scale(this.realScale.x, this.realScale.y);
        if (this.sonicToon.ticking) {
            while (true) {
                if (this.sonicToon.ticking)
                    break;
            }
        }
        canvas.translate(this.screenOffset.x, this.screenOffset.y);
        this.windowLocation.x = <number>(this.sonicToon.x) - this.windowLocation.Width / 2;
        this.windowLocation.y = <number>(this.sonicToon.y) - this.windowLocation.Height / 2;
        this.bigWindowLocation.x = <number>(this.sonicToon.x) - this.bigWindowLocation.Width / 2;
        this.bigWindowLocation.y = <number>(this.sonicToon.y) - this.bigWindowLocation.Height / 2;
        this.bigWindowLocation.x = <number>(this.bigWindowLocation.x - this.windowLocation.Width * 0.2);
        this.bigWindowLocation.y = <number>(this.bigWindowLocation.y - this.windowLocation.Height * 0.2);
        this.bigWindowLocation.Width = <number>(this.windowLocation.Width * 1.8);
        this.bigWindowLocation.Height = <number>(this.windowLocation.Height * 1.8);
    }

    private static drawLoading(canvas:CanvasRenderingContext2D):void {
        canvas.fillStyle = "white";
        canvas.fillText("loading...   ", 95, 95);
        canvas.restore();
        return;
    }

    private drawHaltMode(canvas:CanvasRenderingContext2D):boolean {
        canvas.fillStyle = "white";
        canvas.font = "21pt arial bold";
        canvas.fillText("HALT MODE\r\n Press: P to step\r\n        O to resume", 10, 120);
        if (this.waitingForDrawContinue)
            return true;
        else this.waitingForDrawContinue = true;
        return false;
    }

    private drawLowChunks(canvas:CanvasRenderingContext2D, localPoint:Point, offs:Point[], fyP:number, fxP:number):void {
        for (let off of offs) {
            let _xP:number = fxP + off.x;
            let _yP:number = fyP + off.y;
            let _xPreal:number = fxP + off.x;
            let _yPreal:number = fyP + off.y;
            _xP = Help.mod(_xP, this.sonicLevel.LevelWidth);
            _yP = Help.mod(_yP, this.sonicLevel.LevelHeight);
            let chunk = this.sonicLevel.getChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.x = (_xPreal * 128) - this.windowLocation.x|0;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y|0;
            if (!chunk.isEmpty() && !chunk.OnlyForeground())
                chunk.draw(canvas, localPoint, ChunkLayerState.Low);
        }
    }

    private drawHighChunks(canvas:CanvasRenderingContext2D, fxP:number, fyP:number, offs:Point[], localPoint:Point):void {
        var m=[];

        for (let off of offs) {
            let _xP:number = fxP + off.x;
            let _yP:number = fyP + off.y;
            let _xPreal:number = fxP + off.x;
            let _yPreal:number = fyP + off.y;
            _xP = Help.mod(_xP, this.sonicLevel.LevelWidth);
            _yP = Help.mod(_yP, this.sonicLevel.LevelHeight);
            let chunk = this.sonicLevel.getChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.x = (_xPreal * 128) - this.windowLocation.x|0;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y|0;
            if (!chunk.isEmpty() && !chunk.onlyBackground()) {

       m.push(localPoint.x+" "+localPoint.y)         ;
                chunk.draw(canvas, localPoint, ChunkLayerState.High);
            }
            if (this.showHeightMap) {
                let fd = this.spriteCache.HeightMapChunks[(this.sonicLevel.CurHeightMap ? 1 : 2) + " " + chunk.Index];
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
        console.log(m);
    }

    private drawDebugTextChunks(canvas:CanvasRenderingContext2D, fxP:number, fyP:number, offs:Point[], localPoint:Point):void {
        for (let off of offs) {
            let _xP:number = fxP + off.x;
            let _yP:number = fyP + off.y;
            let _xPreal:number = fxP + off.x;
            let _yPreal:number = fyP + off.y;
            _xP = Help.mod(_xP, this.sonicLevel.LevelWidth);
            _yP = Help.mod(_yP, this.sonicLevel.LevelHeight);
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

    private cacheHeightMapForChunk(chunk:TileChunk):CanvasInformation {
        let md = chunk;
        let posj1 = new Point(0, 0);
        let canv = CanvasInformation.create(128, 128, false);
        let ctx = canv.Context;
        this.engine.Clear(canv);
        for (let _y = 0; _y < 8; _y++) {
            for (let _x = 0; _x < 8; _x++) {
                let tp = md.TilePieces[_x][_y];
                let solid = <number>(this.sonicLevel.CurHeightMap ? tp.Solid1 : tp.Solid2);
                let hd = this.sonicLevel.CurHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
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
                    vangle = this.sonicLevel.CurHeightMap ? tp.GetLayer1Angles() : tp.GetLayer2Angles();
                    hd.Draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
                }
            }
        }
        return this.spriteCache.HeightMapChunks[(this.sonicLevel.CurHeightMap ? 1 : 2) + " " + md.Index] = canv;
    }

    private drawSonic(canvas:CanvasRenderingContext2D):void {
        if (this.currentGameState == GameState.Playing) {
            this.sonicToon.draw(canvas);
        }
    }

    private drawRings(canvas:CanvasRenderingContext2D, localPoint:Point):void {
        for (let index:number = 0; index < this.sonicLevel.Rings.length; index++) {
            let r = this.sonicLevel.Rings[index];
            switch (this.currentGameState) {
                case GameState.Playing:
                    if (!this.sonicToon.obtainedRing[index]) {
                        if (this.bigWindowLocation.Intersects(r))
                            this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x|0, this.windowLocation.y|0));
                    }
                    break;
                case GameState.Editing:
                    if (this.bigWindowLocation.Intersects(r))
                        this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x|0, this.windowLocation.y|0));
                    break;
            }
        }
        switch (this.currentGameState) {
            case GameState.Playing:
                for (let i:number = this.activeRings.length - 1; i >= 0; i--) {
                    let ac:Ring = this.activeRings[i];
                    localPoint.x = ac.x - this.windowLocation.x|0;
                    localPoint.y = ac.y - this.windowLocation.y|0;
                    ac.Draw(canvas, localPoint);
                    if (ac.TickCount > 256)
                        this.activeRings.splice(i, 1);
                }
                break;
            case GameState.Editing:
                break;
        }
    }

    private drawAnimations(canvas:CanvasRenderingContext2D):void {
        for (let ano of this.animationInstances) {
            ano.Draw(canvas, -this.windowLocation.x|0, -this.windowLocation.y|0);
        }
    }

    private drawObjects(canvas:CanvasRenderingContext2D, localPoint:Point):void {
        let levelObjectInfos:LevelObjectInfo[] = this.sonicLevel.Objects;
        for (let o of levelObjectInfos) {
            localPoint.x = o.X;
            localPoint.y = o.Y;
            if (o.Dead || this.bigWindowLocation.Intersects(localPoint)) {
                o.Draw(canvas,
                    ((localPoint.x - this.windowLocation.x))|0,
                    ((localPoint.y - this.windowLocation.y))|0,
                    this.showHeightMap);
            }
        }
    }

    private containsAnimatedTile(tile:number, sonLevel:SonicLevel):TileAnimationData {
        for (let an of sonLevel.TileAnimations) {
            let anin = an.AnimationTileIndex;
            let num = an.NumberOfTiles;
            if (tile >= anin && tile < anin + num)
                return an;
        }
        return null;
    }

    public clearCache():void {
        if (this.spriteCache != null)
            this.spriteCache.ClearCache();
        if (this.sonicLevel != null)
            this.sonicLevel.ClearCache();
        if (this.tilePaletteAnimationManager != null)
            this.tilePaletteAnimationManager.ClearCache();
        if (this.tileAnimationManager != null)
            this.tileAnimationManager.ClearCache();
    }

    public mouseUp(queryEvent:JQueryEventObject):boolean {
        this.clicking = false;
        return false;
    }

    public mouseMove(queryEvent:JQueryEventObject):boolean {
        if (this.clicking)
            if (this.effectClick(queryEvent))
                return true;
        return false;
    }

    public ReplaceMagic():void {
        this.Replace(new Rectangle(0, 0, 15, 30), new Point(712, 40));
    }

    public Replace(from:Rectangle, to:Point):void {
        for (let y:number = from.Height; y >= 0; y--) {
            let curY:number = y;
            window.setTimeout(() => {
                    for (let x:number = 0; x < from.Width; x++) {
                        let toChunkX = (to.x + x) / 8;
                        let toChunkY = (to.y + curY) / 8;
                        let tochunk = this.sonicLevel.getChunkAt(toChunkX, toChunkY);
                        tochunk.ClearCache();
                        let totp = tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                        tochunk.IsOnlyBackground = null;
                        tochunk.IsOnlyForeground = null;
                        let fromChunkX = (from.x + x) / 8 | 0;
                        let fromChunkY = (from.y + curY) / 8 | 0;
                        let fromchunk = this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                        fromchunk.ClearCache();
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

    public cacheTiles():void {
        console.time("tileCache");
        this.tilePaletteAnimationManager = new TilePaletteAnimationManager(this);
        this.tileAnimationManager = new TileAnimationManager(this);
        for (let chunk of this.sonicLevel.TileChunks) {
            chunk.InitCache();
            chunk.WarmCache();
        }
        console.timeEnd("tileCache");
        if (this.sonicToon != null) {
            console.time("collisionCache");
            for (let chunk of this.sonicLevel.TileChunks) {
                this.sonicToon.sensorManager.buildChunk(chunk, false);
                this.sonicToon.sensorManager.buildChunk(chunk, true);
            }
            console.timeEnd("collisionCache");
        }
        if (false) {
            this.debugDraw();
        }
    }

    private debugDraw():void {
        let numWide:number = 10;
        let dropOffIndex:number = 0;
        let pieces:string[] = new Array<string>();
        while (true) {
            let debugCanvases:CanvasInformation[] = new Array<CanvasInformation>();
            let totalHeight:number = 0;
            let broke = false;
            for (let index:number = dropOffIndex; index < this.sonicLevel.TileChunks.length; index++) {
                let chunk = this.sonicLevel.TileChunks[index];
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
            let currentPosition:number = 0;
            for (let index:number = 0; index < debugCanvases.length; index++) {
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
    public cachedObjects:{ [key:string]:LevelObject };

    public loadObjects(objects:{ key:string, value:string }[]):void {
        this.cachedObjects = {};
        for (var t of this.sonicLevel.Objects) {
            let o = t.Key;

            if (this.cachedObjects[o]) {
                t.SetObjectData(this.cachedObjects[o]);
                continue;
            }
            let d = objects.filter(p => p.key == o)[0];
            if (!d) {
                t.SetObjectData(new LevelObject(o));
                continue;
            }
            let dat:LevelObjectData;
            if (d.value.length == 0)
                dat = new LevelObjectData();
            else dat = <LevelObjectData>JSON.parse(d.value);
            let dr = ObjectManager.ExtendObject(dat);
            this.cachedObjects[o] = dr;
            t.SetObjectData(dr);

        }

    }

    public downloadObjects(objects:string[]):void {
        SonicEngine.instance.client.emit("GetObjects", objects);
    }

    public Load(sonicLevel:SlData):void {
        this.loading = true;
        this.sonicLevel = new SonicLevel();
        for (let n = 0; n < sonicLevel.Rings.length; n++) {
            this.sonicLevel.Rings[n] = new Ring(true);
            this.sonicLevel.Rings[n].x = sonicLevel.Rings[n].X;
            this.sonicLevel.Rings[n].y = sonicLevel.Rings[n].Y;
        }
        this.sonicLevel.LevelWidth = sonicLevel.ForegroundWidth;
        this.sonicLevel.LevelHeight = sonicLevel.ForegroundHeight;
        this.sonicLevel.ChunkMap = sonicLevel.Foreground;
        this.sonicLevel.BGChunkMap = sonicLevel.Background;
        for (let l:number = 0; l < sonicLevel.Objects.length; l++) {
            this.sonicLevel.Objects[l] = new LevelObjectInfo(sonicLevel.Objects[l]);
            this.sonicLevel.Objects[l].Index = l;
        }
        let objectKeys = new Array<string>();
        this.sonicLevel.Objects.forEach(t => {
            let o = t.Key;
            if (objectKeys.filter(p => p != o).length == objectKeys.length)
                objectKeys.push(o);
        });
        this.downloadObjects(objectKeys);
        for (let j:number = 0; j < sonicLevel.Tiles.length; j++) {
            let fc = sonicLevel.Tiles[j];
            let tiles = fc;
            let mj:number[] = new Array<number>();
            for (let i:number = 0; i < tiles.length; i++) {
                let value = sonicLevel.Tiles[j][i];
                mj.push((value >> 4));
                mj.push((value & 0xF));
            }
            let mfc = new Array(8);
            for (let o:number = 0; o < 8; o++) {
                mfc[o] = new Array(8);
            }
            for (let n:number = 0; n < mj.length; n++) {
                mfc[n % 8][n / 8 | 0] = mj[n];
            }
            this.sonicLevel.Tiles[j] = new Tile(mfc);
            this.sonicLevel.Tiles[j].Index = j;
        }
        let acs = this.sonicLevel.AnimatedChunks = new Array<TileChunk>();
        if (sonicLevel.AnimatedFiles) {
            this.sonicLevel.AnimatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
            for (let animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                let animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                this.sonicLevel.AnimatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
                for (let filePiece:number = 0; filePiece < animatedFile.length; filePiece++) {
                    let c = animatedFile[filePiece];
                    let tiles = c;
                    let mjc:number[] = new Array<number>();
                    for (let l:number = 0; l < tiles.length; l++) {
                        let value = animatedFile[filePiece][l];
                        mjc.push((value >> 4));
                        mjc.push((value & 0xF));
                    }
                    let mfc = new Array(8);
                    for (let o:number = 0; o < 8; o++) {
                        mfc[o] = new Array(8);
                    }
                    for (let n:number = 0; n < mjc.length; n++) {
                        mfc[n % 8][n / 8 | 0] = mjc[n];
                    }
                    let tile:Tile = new Tile(mfc);
                    tile.IsTileAnimated = true;
                    tile.Index = filePiece * 10000 + animatedFileIndex;
                    this.sonicLevel.AnimatedTileFiles[animatedFileIndex][filePiece] = tile;
                }
            }
        }
        for (let j:number = 0; j < sonicLevel.Blocks.length; j++) {
            let fc = sonicLevel.Blocks[j];
            let mj = new TilePiece();
            mj.Index = j;
            mj.Tiles = new Array<TileInfo>();
            for (let p:number = 0; p < fc.length; p++) {
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
            this.sonicLevel.TilePieces[j] = mj;
        }
        this.sonicLevel.Angles = sonicLevel.Angles;
        this.sonicLevel.TileAnimations = sonicLevel.Animations.map(a => Help.merge(new TileAnimationData(), {
            AnimationTileFile: a.AnimationFile,
            AnimationTileIndex: a.AnimationTileIndex,
            AutomatedTiming: a.AutomatedTiming,
            NumberOfTiles: a.NumberOfTiles,
            DataFrames: a.Frames.map(b => Help.merge(new TileAnimationDataFrame(), {Ticks: b.Ticks, StartingTileIndex: b.StartingTileIndex})).slice(0)
        }));
        this.sonicLevel.CollisionIndexes1 = sonicLevel.CollisionIndexes1;
        this.sonicLevel.CollisionIndexes2 = sonicLevel.CollisionIndexes2;
        for (let i:number = 0; i < sonicLevel.HeightMaps.length; i++) {
            let b1 = true;
            let b2 = true;
            for (let m:number = 0; m < sonicLevel.HeightMaps[i].length; m++) {
                if (b1 && sonicLevel.HeightMaps[i][m] !== 0)
                    b1 = false;
                if (b2 && sonicLevel.HeightMaps[i][m] !== 16)
                    b2 = false;
            }
            if (b1)
                this.sonicLevel.HeightMaps[i] = HeightMap.FullHeight(false);
            else if (b2)
                this.sonicLevel.HeightMaps[i] = HeightMap.FullHeight(true);
            else this.sonicLevel.HeightMaps[i] = new HeightMap(sonicLevel.HeightMaps[i], i);
        }
        for (let j:number = 0; j < sonicLevel.Chunks.length; j++) {
            let fc = sonicLevel.Chunks[j];
            let mj = new TileChunk();
            mj.Index = j;
            mj.TilePieces = new Array(8);
            for (let i:number = 0; i < 8; i++) {
                mj.TilePieces[i] = new Array(8);
            }
            for (let p:number = 0; p < fc.length; p++) {
                mj.TilePieces[p % 8][(p / 8) | 0] = Help.merge(new TilePieceInfo(), {
                    Index: p,
                    Block: fc[p].Block,
                    Solid1: fc[p].Solid1,
                    Solid2: fc[p].Solid2,
                    XFlip: fc[p].XFlip,
                    YFlip: fc[p].YFlip
                });
            }
            this.sonicLevel.TileChunks[j] = mj;
            mj.TileAnimations = {};
            for (let tpX:number = 0; tpX < mj.TilePieces.length; tpX++) {
                for (let tpY:number = 0; tpY < mj.TilePieces[tpX].length; tpY++) {
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
        this.sonicLevel.Palette = sonicLevel.Palette.map(a => a.map(b => "#" + b));
        this.sonicLevel.StartPositions = sonicLevel.StartPositions.map(a => new Point(a.X, a.Y));
        this.sonicLevel.AnimatedPalettes = new Array<PaletteItem>();
        if (sonicLevel.PaletteItems.length > 0) {
            for (let k:number = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                let pal:AnimatedPaletteItem = sonicLevel.PaletteItems[0][k];
                this.sonicLevel.AnimatedPalettes.push(Help.merge(new PaletteItem(), {
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
        for (let tilePiece of this.sonicLevel.TilePieces) {
            tilePiece.AnimatedPaletteIndexes = new Array<number>();
            tilePiece.AnimatedTileIndexes = new Array<number>();
            if (this.sonicLevel.AnimatedPalettes.length > 0) {
                for (let mj of tilePiece.Tiles) {
                    let tile:Tile = mj.GetTile();
                    if (tile) {
                        tile.AnimatedPaletteIndexes = new Array<number>();
                        let pl = tile.GetAllPaletteIndexes();
                        tile.PaletteIndexesToBeAnimated = {};
                        tile.AnimatedTileIndexes = new Array<number>();
                        for (let tileAnimationIndex:number = 0; tileAnimationIndex < this.sonicLevel.TileAnimations.length; tileAnimationIndex++) {
                            let tileAnimationData = this.sonicLevel.TileAnimations[tileAnimationIndex];
                            let anin = tileAnimationData.AnimationTileIndex;
                            let num = tileAnimationData.NumberOfTiles;
                            if (tile.Index >= anin && tile.Index < anin + num) {
                                tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                tile.AnimatedTileIndexes.push(tileAnimationIndex);
                            }
                        }
                        for (let animatedPaletteIndex:number = 0; animatedPaletteIndex < this.sonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                            let pal = this.sonicLevel.AnimatedPalettes[animatedPaletteIndex];
                            tile.PaletteIndexesToBeAnimated[animatedPaletteIndex] = new Array<number>();
                            for (let mjce of pal.Pieces) {
                                let mje1:PaletteItemPieces = mjce;
                                if (mj.Palette == mje1.PaletteIndex) {
                                    if (pl.filter(j => j == (mje1.PaletteOffset / 2 | 0) || j == (mje1.PaletteOffset / 2 | 0) + 1).length > 0) {
                                        tilePiece.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                        tile.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                        for (let pIndex of pl) {
                                            if (pIndex == (mje1.PaletteOffset / 2 | 0) || pIndex == (mje1.PaletteOffset / 2 | 0) + 1) {
                                                tile.PaletteIndexesToBeAnimated[animatedPaletteIndex].push(pIndex);
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
        this.PreloadSprites(() => {
                finished();
                this.forceResize();
            },
            (s) => {
            });
        this.forceResize();
        this.onLevelLoad && this.onLevelLoad(this.sonicLevel);
    }
}
import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../Common/Utils";
import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicEngine} from "./SonicEngine";
import {SonicImage} from "./Level/SonicImage";
import {GameState, ClickState, ChunkLayerState } from "../Common/Enums";
import {Help} from "../Common/Help";
import {Sonic} from "./Sonic/Sonic";
import {HeightMap} from "./Level/HeightMap";
import {ObjectManager } from "./Level/Objects/ObjectManager";
import {SonicLevel, PaletteItem, PaletteItemPieces }from "./SonicLevel";
import {LevelObjectInfo } from "./Level/Objects/LevelObjectInfo";
import {Ring  } from "./Level/Ring";
import {SpriteCache } from "./Level/SpriteCache";
import {TileAnimationData, TileAnimationDataFrame } from "./Level/Animations/TileAnimationData";
import {AnimationInstance, } from "./Level/Animations/AnimationInstance";
import {TilePaletteAnimationManager } from "./Level/Tiles/TilePaletteAnimationManager";
import {TileAnimationManager } from "./Level/Tiles/TileAnimationManager";
import {TileChunkDebugDrawOptions, TileChunk } from "./Level/Tiles/TileChunk";
import {SpriteLoader } from "../Common/SpriteLoader";
import {SonicBackground} from "./Level/SonicBackground";
import {LevelObject} from "./Level/Objects/LevelObject";
import {LevelObjectData} from "./Level/Objects/LevelObjectData";
import {SLData as SlData, AnimatedPaletteItem } from "../SLData";
import {Tile } from "./Level/Tiles/Tile";
import {TilePiece} from "./Level/Tiles/TilePiece";
import {TileInfo } from "./Level/Tiles/TileInfo";
import {TilePieceInfo} from "./Level/Tiles/TilePieceInfo";

export class SonicManager {
    public static Instance: SonicManager;
    private static _cachedOffs: { [key: number]: Point[] } = {};
    public mainCanvas: CanvasInformation;
    private engine: SonicEngine;
    public objectManager: ObjectManager;
    public DrawTickCount: number;
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
    public CurrentGameState: GameState;
    public BigWindowLocation: IntersectingRectangle;
    public SonicToon: Sonic;
    public scale: Point;
    public WindowLocation: IntersectingRectangle;
    public RealScale: DoublePoint;
    public InHaltMode: boolean;
    public IndexedPalette: number;
    public TileAnimations: TileAnimationData[];
    public AnimationInstances: AnimationInstance[];
    public GoodRing: Ring;
    public ShowHeightMap: boolean;
    public ScreenOffset: Point;
    public ActiveRings: Ring[];
    public ForceResize: () => void;
    public Background: SonicBackground;
    public ClickState: ClickState;
    public SonicLevel: SonicLevel;
    public InFocusObjects: LevelObjectInfo[];
    protected Loading: boolean;
    public SpriteCache: SpriteCache;
    protected SpriteLoader: SpriteLoader;
    public OnLevelLoad: (_: SonicLevel) => void;
    public TileChunkDebugDrawOptions: TileChunkDebugDrawOptions;


    public TilePaletteAnimationManager: TilePaletteAnimationManager;

    public TileAnimationManager: TileAnimationManager;

    constructor(engine: SonicEngine, gameCanvas: CanvasInformation, resize: () => void) {
        SonicManager.Instance = this;
        this.engine = engine;
        this.engine.canvasWidth = $(window).width();
        this.engine.canvasHeight = $(window).height();
        gameCanvas.DomCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
        gameCanvas.DomCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
        jQuery.getJSON("content/sprites/sonic.js", (data: { [key: string]: SonicImage }) => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        let scl: number = 4;
        this.scale = new Point(scl, scl);
        this.RealScale = new DoublePoint(1, 1);
        this.mainCanvas = gameCanvas;
        this.WindowLocation = Help.DefaultWindowLocation(GameState.Editing, this.scale);
        this.BigWindowLocation = Help.DefaultWindowLocation(GameState.Editing, this.scale);
        this.BigWindowLocation.Width = <number>(this.BigWindowLocation.Width * 1.8);
        this.BigWindowLocation.Height = <number>(this.BigWindowLocation.Height * 1.8);
        this.TileAnimations = new Array<TileAnimationData>();
        this.AnimationInstances = new Array<AnimationInstance>();
        this.ShowHeightMap = false;
        this.GoodRing = new Ring(false);
        this.ActiveRings = new Array<Ring>();
        this.ForceResize = resize;
        this.Background = null;
        this.CurrentGameState = GameState.Editing;
        this.ScreenOffset = new Point(this.mainCanvas.DomCanvas.width() / 2 - this.WindowLocation.Width / 2,
            this.mainCanvas.DomCanvas.height() / 2 - this.WindowLocation.Height / 2);
        this.ClickState = ClickState.PlaceChunk;
        this.tickCount = 0;
        this.DrawTickCount = 0;
        this.InHaltMode = false;
        this.waitingForTickContinue = false;
        this.waitingForDrawContinue = false;
        this.TileChunkDebugDrawOptions = new TileChunkDebugDrawOptions();
    }
    public OnClick(Event: JQueryEventObject): boolean {
        this.clicking = true;
        if (this.effectClick(Event))
            return true;
        return false;
    }
    private effectClick(event: JQueryEventObject): boolean {
        let e = new Point(<number>(<number>event.clientX / this.scale.X / this.RealScale.X + this.WindowLocation.X),
            <number>(<number>event.clientY / this.scale.Y / this.RealScale.Y + this.WindowLocation.Y));
        let ey: number;
        let ex: number;
        if (event.ctrlKey) {
            ex = e.X / 128 | 0;
            ey = e.Y / 128 | 0;
            let ch = this.SonicLevel.GetChunkAt(ex, ey);
            //            if (this.UIManager.UIManagerAreas.TilePieceArea != null)
            //                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, this.UIManager.UIManagerAreas.TilePieceArea.Data, true);
            return true;
        }
        if (event.shiftKey) {
            ex = e.X / 128 | 0;
            ey = e.Y / 128 | 0;
            let ch = this.SonicLevel.GetChunkAt(ex, ey);
            //            if (this.UIManager.UIManagerAreas.TileChunkArea != null)
            //                this.SonicLevel.SetChunkAt(ex, ey, this.UIManager.UIManagerAreas.TileChunkArea.Data);
            return true;
        }
        if (event.button == 0) {
            switch (this.ClickState) {
                case ClickState.Dragging:
                    return true;
                case ClickState.PlaceChunk:
                    ex = e.X / 128 | 0;
                    ey = e.Y / 128 | 0;
                    let ch = this.SonicLevel.GetChunkAt(ex, ey);
                    let tp = ch.GetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, true);
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
                    this.ClearCache();
                    return true;
                case ClickState.PlaceRing:
                    ex = e.X;
                    ey = e.Y;
                    this.SonicLevel.Rings.push(Help.Merge(new Ring(true), { X: ex, Y: ey }));
                    return true;
                case ClickState.PlaceObject:
                    ex = e.X;
                    ey = e.Y;
                    let pos = new Point(ex, ey);
                    for (let o of this.SonicLevel.Objects) {
                        if (IntersectingRectangle.IntersectsRect(o.GetRect(), pos))
                            alert("Object Data: " + Help.Stringify(o));
                    }
                    return true;
            }
        }
        return false;
    }
    private tickObjects(): void {
        let localPoint = new Point(0, 0);
        this.InFocusObjects = new Array<LevelObjectInfo>();
        let levelObjectInfos = this.SonicLevel.Objects;
        for (let obj of levelObjectInfos) {
            localPoint.X = <number>obj.X;
            localPoint.Y = <number>obj.Y;
            if (this.BigWindowLocation.Intersects(localPoint)) {
                this.InFocusObjects.push(obj);
                obj.Tick(obj, this.SonicLevel, this.SonicToon);
            }
        }
        //        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
        //            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
        for (let animationInstance of this.AnimationInstances) {
            animationInstance.Tick();
        }
    }
    public Tick(): void {
        if (this.Loading)
            return
        if (this.CurrentGameState == GameState.Playing) {
            if (this.InHaltMode) {
                if (this.waitingForTickContinue)
                    return
            }
            this.tickCount++;
            this.tickObjects();
            this.SonicToon.Ticking = true;
            try {
                this.SonicToon.Tick(this.SonicLevel);
            }

            finally {
                this.SonicToon.Ticking = false;
            }
            if (this.InHaltMode) {
                if (this.waitingForTickContinue)
                    return
                this.waitingForTickContinue = true;
                this.waitingForDrawContinue = false;
            }
        }
    }
    public PreloadSprites(completed: () => void, update: (_: string) => void): void {
        if (this.SpriteCache != null) {
            completed();
            return
        }
        this.SpriteCache = this.SpriteCache != null ? this.SpriteCache : new SpriteCache();
        let ci = this.SpriteCache.Rings;
        let spriteLocations = new Array<string>();
        for (let j: number = 0; j < 4; j++) {
            spriteLocations.push(`assets/sprites/ring${j}.png`);
            this.imageLength++;
        }
        let ind_ = this.SpriteCache.Indexes;
        this.SpriteLoader = new SpriteLoader(completed, update);
        if (ci.length == 0) {
            let spriteStep = this.SpriteLoader.AddStep("Sprites",
                (i, done) => {
                    Help.LoadSprite(spriteLocations[i],
                        jd => {
                            ci[i] = CanvasInformation.Create(jd.width, jd.height, false);
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
                this.SpriteLoader.AddIterationToStep(spriteStep, i);
            }
        }
        let cci = this.SpriteCache.SonicSprites;

        if (Object.keys(cci).length == 0) {
            let sonicStep = this.SpriteLoader.AddStep("Sonic Sprites",
                (sp, done) => {
                    for (let sonicSprite in this.sonicSprites) {
                        cci[sonicSprite] = Help.ScaleCsImage(this.sonicSprites[sonicSprite], new Point(1, 1), (ec) => {

                        });
                    }
                    done();
                },
                () => true,
                false);
            this.SpriteLoader.AddIterationToStep(sonicStep, 0);
        }
    }
    public MainDraw(canvas: CanvasInformation): void {
        let context = canvas.Context;
        if (this.InHaltMode)
            if (this.drawHaltMode(context))
                return
        this.engine.Clear(canvas);
        if (this.SonicLevel == null)
            return
        context.save();
        let localPoint = new Point(0, 0);
        this.DrawTickCount++;
        if (this.SpriteLoader && !this.SpriteLoader.Tick() || this.Loading) {
            SonicManager.drawLoading(context);
            context.restore();
            return;
        }
        this.updatePositions(context);
        let w1: number = this.WindowLocation.Width / 128 + 2;
        let h1: number = this.WindowLocation.Height / 128 + 2;
        if (this.CurrentGameState == GameState.Editing) {
            w1 += 1;
            h1 += 1;
            w1 /= this.scale.X;
            h1 /= this.scale.Y;
        }
        let offs = SonicManager.getOffs(w1, h1);
        this.TilePaletteAnimationManager.TickAnimatedPalettes();
        this.TileAnimationManager.TickAnimatedTiles();
        let fxP: number = ((this.WindowLocation.X) / 128) | 0;
        let fyP: number = ((this.WindowLocation.Y) / 128) | 0;
        this.ResetCanvases();
        let zero = new Point(0, 0);
        if (this.Background) {
            let wOffset: number = this.WindowLocation.X;
            let bw: number = this.Background.Width;
            let movex: number = (wOffset / bw) * bw;
            localPoint.X = -this.WindowLocation.X + movex;
            localPoint.Y = -this.WindowLocation.Y / 4;
            this.Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
            localPoint.X = -this.WindowLocation.X + movex + this.Background.Width;
            localPoint.Y = -this.WindowLocation.Y / 4;
            this.Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
        }
        this.drawLowChunks(this.lowChunkCanvas.Context, zero, offs, fyP, fxP);
        if (this.ShowHeightMap)
            this.drawHighChunks(this.lowChunkCanvas.Context, fxP, fyP, offs, zero);
        this.drawObjects(this.sonicCanvas.Context, zero);
        this.drawAnimations(this.sonicCanvas.Context);
        this.drawRings(this.sonicCanvas.Context, zero);
        this.drawSonic(this.sonicCanvas.Context);
        if (!this.ShowHeightMap)
            this.drawHighChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        this.drawDebugTextChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        //        this.lowChunkCanvas.Context.OffsetPixelsForWater();
        //        this.highChuckCanvas.Context.OffsetPixelsForWater();
        this.drawCanveses(context, localPoint);
        context.restore();
        if (this.CurrentGameState == GameState.Playing)
            this.SonicToon.DrawUI(context, new Point(this.ScreenOffset.X, this.ScreenOffset.Y));
    }
    private drawCanveses(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        canvas.scale(this.scale.X, this.scale.Y);
        canvas.drawImage(this.lowChunkCanvas.Canvas, localPoint.X, localPoint.Y);
        canvas.drawImage(this.sonicCanvas.Canvas, localPoint.X, localPoint.Y);
        canvas.drawImage(this.highChuckCanvas.Canvas, localPoint.X, localPoint.Y);
    }
    public ResetCanvases(): void {
        this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation.Create(this.WindowLocation.Width, this.WindowLocation.Height, false);
        this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation.Create(this.WindowLocation.Width, this.WindowLocation.Height, true);
        this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation.Create(this.WindowLocation.Width, this.WindowLocation.Height, false);
        this.sonicCanvas.Context.clearRect(0, 0, this.WindowLocation.Width, this.WindowLocation.Height);
        this.highChuckCanvas.Context.clearRect(0, 0, this.WindowLocation.Width, this.WindowLocation.Height);
        this.lowChunkCanvas.Context.clearRect(0, 0, this.WindowLocation.Width, this.WindowLocation.Height);
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
        this.ScreenOffset.X = 0;
        this.ScreenOffset.Y = 0;
        if (this.CurrentGameState == GameState.Playing)
            this.updatePositionsForPlaying(canvas);
    }
    private updatePositionsForPlaying(canvas: CanvasRenderingContext2D): void {
        canvas.scale(this.RealScale.X, this.RealScale.Y);
        if (this.SonicToon.Ticking) {
            while (true) {
                if (this.SonicToon.Ticking)
                    break;
            }
        }
        canvas.translate(this.ScreenOffset.X, this.ScreenOffset.Y);
        this.WindowLocation.X = <number>(this.SonicToon.X) - this.WindowLocation.Width / 2;
        this.WindowLocation.Y = <number>(this.SonicToon.Y) - this.WindowLocation.Height / 2;
        this.BigWindowLocation.X = <number>(this.SonicToon.X) - this.BigWindowLocation.Width / 2;
        this.BigWindowLocation.Y = <number>(this.SonicToon.Y) - this.BigWindowLocation.Height / 2;
        this.BigWindowLocation.X = <number>(this.BigWindowLocation.X - this.WindowLocation.Width * 0.2);
        this.BigWindowLocation.Y = <number>(this.BigWindowLocation.Y - this.WindowLocation.Height * 0.2);
        this.BigWindowLocation.Width = <number>(this.WindowLocation.Width * 1.8);
        this.BigWindowLocation.Height = <number>(this.WindowLocation.Height * 1.8);
    }
    private static drawLoading(canvas: CanvasRenderingContext2D): void {
        canvas.fillStyle = "white";
        canvas.fillText("Loading...   ", 95, 95);
        canvas.restore();
        return;
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
            let _xP: number = fxP + off.X;
            let _yP: number = fyP + off.Y;
            let _xPreal: number = fxP + off.X;
            let _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.SonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.SonicLevel.LevelHeight);
            let chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - this.WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - this.WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                chunk.Draw(canvas, localPoint, ChunkLayerState.Low);
        }
    }
    private drawHighChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
        for (let off of offs) {
            let _xP: number = fxP + off.X;
            let _yP: number = fyP + off.Y;
            let _xPreal: number = fxP + off.X;
            let _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.SonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.SonicLevel.LevelHeight);
            let chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - this.WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - this.WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                chunk.Draw(canvas, localPoint, ChunkLayerState.High);
            if (this.ShowHeightMap) {
                let fd = this.SpriteCache.HeightMapChunks[(this.SonicLevel.CurHeightMap ? 1 : 2) + " " + chunk.Index];
                if (fd == null) {
                    fd = this.cacheHeightMapForChunk(chunk);
                }
                canvas.drawImage(fd.Canvas, localPoint.X, localPoint.Y);
            }
            if (this.CurrentGameState == GameState.Editing) {
                canvas.strokeStyle = "#DD0033";
                canvas.lineWidth = 3;
                canvas.strokeRect(localPoint.X, localPoint.Y, 128, 128);
            }
        }
    }
    private drawDebugTextChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
        for (let off of offs) {
            let _xP: number = fxP + off.X;
            let _yP: number = fyP + off.Y;
            let _xPreal: number = fxP + off.X;
            let _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.SonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.SonicLevel.LevelHeight);
            let chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - this.WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - this.WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayerState.Low, this.TileChunkDebugDrawOptions);
            if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayerState.High, this.TileChunkDebugDrawOptions);
        }
    }
    private cacheHeightMapForChunk(chunk: TileChunk): CanvasInformation {
        let md = chunk;
        let posj1 = new Point(0, 0);
        let canv = CanvasInformation.Create(128, 128, false);
        let ctx = canv.Context;
        this.engine.Clear(canv);
        for (let _y = 0; _y < 8; _y++) {
            for (let _x = 0; _x < 8; _x++) {
                let tp = md.TilePieces[_x][_y];
                let solid = <number>(this.SonicLevel.CurHeightMap ? tp.Solid1 : tp.Solid2);
                let hd = this.SonicLevel.CurHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
                let __x = _x;
                let __y = _y;
                let vangle = 0;
                let posm = new Point(posj1.X + (__x * 16), posj1.Y + (__y * 16));
                if (!hd)
                    continue;
                if (hd.Full === false) {

                }
                else if (hd.Full === true) {
                    if (solid > 0) {
                        ctx.fillStyle = HeightMap.colors[solid];
                        ctx.fillRect(posj1.X + (__x * 16),
                            posj1.Y + (__y * 16),
                            16,
                            16);
                    }
                }
                else {
                    vangle = this.SonicLevel.CurHeightMap ? tp.GetLayer1Angles() : tp.GetLayer2Angles();
                    hd.Draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
                }
            }
        }
        return this.SpriteCache.HeightMapChunks[(this.SonicLevel.CurHeightMap ? 1 : 2) + " " + md.Index] = canv;
    }
    private drawSonic(canvas: CanvasRenderingContext2D): void {
        if (this.CurrentGameState == GameState.Playing) {
            this.SonicToon.Draw(canvas);
        }
    }
    private drawRings(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        for (let index: number = 0; index < this.SonicLevel.Rings.length; index++) {
            let r = this.SonicLevel.Rings[index];
            switch (this.CurrentGameState) {
                case GameState.Playing:
                    if (!this.SonicToon.obtainedRing[index]) {
                        if (this.BigWindowLocation.Intersects(r))
                            this.GoodRing.Draw(canvas, r.Negate(this.WindowLocation.X, this.WindowLocation.Y));
                    }
                    break;
                case GameState.Editing:
                    if (this.BigWindowLocation.Intersects(r))
                        this.GoodRing.Draw(canvas, r.Negate(this.WindowLocation.X, this.WindowLocation.Y));
                    break;
            }
        }
        switch (this.CurrentGameState) {
            case GameState.Playing:
                for (let i: number = this.ActiveRings.length - 1; i >= 0; i--) {
                    let ac: Ring = this.ActiveRings[i];
                    localPoint.X = ac.X - this.WindowLocation.X;
                    localPoint.Y = ac.Y - this.WindowLocation.Y;
                    ac.Draw(canvas, localPoint);
                    if (ac.TickCount > 256)
                        this.ActiveRings.splice(i, 1);
                }
                break;
            case GameState.Editing:
                break;
        }
    }
    private drawAnimations(canvas: CanvasRenderingContext2D): void {
        for (let ano of this.AnimationInstances) {
            ano.Draw(canvas, -this.WindowLocation.X, -this.WindowLocation.Y);
        }
    }
    private drawObjects(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        let levelObjectInfos: LevelObjectInfo[] = this.SonicLevel.Objects;
        for (let o of levelObjectInfos) {
            localPoint.X = o.X;
            localPoint.Y = o.Y;
            if (o.Dead || this.BigWindowLocation.Intersects(localPoint)) {
                o.Draw(canvas,
                    ((localPoint.X - this.WindowLocation.X)),
                    ((localPoint.Y - this.WindowLocation.Y)),
                    this.ShowHeightMap);
            }
        }
    }
    private containsAnimatedTile(tile: number, sonLevel: SonicLevel): TileAnimationData {
        for (let an of sonLevel.TileAnimations) {
            let anin = an.AnimationTileIndex;
            let num = an.NumberOfTiles;
            if (tile >= anin && tile < anin + num)
                return an;
        }
        return null;
    }
    public ClearCache(): void {
        if (this.SpriteCache != null)
            this.SpriteCache.ClearCache();
        if (this.SonicLevel != null)
            this.SonicLevel.ClearCache();
        if (this.TilePaletteAnimationManager != null)
            this.TilePaletteAnimationManager.ClearCache();
        if (this.TileAnimationManager != null)
            this.TileAnimationManager.ClearCache();
    }
    public MouseUp(queryEvent: JQueryEventObject): boolean {
        this.clicking = false;
        return false;
    }
    public MouseMove(queryEvent: JQueryEventObject): boolean {
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
                    let toChunkX = (to.X + x) / 8;
                    let toChunkY = (to.Y + curY) / 8;
                    let tochunk = this.SonicLevel.GetChunkAt(toChunkX, toChunkY);
                    tochunk.ClearCache();
                    let totp = tochunk.TilePieces[(to.X + x) - toChunkX * 8][(to.Y + curY) - toChunkY * 8];
                    tochunk.IsOnlyBackground = null;
                    tochunk.IsOnlyForeground = null;
                    let fromChunkX = (from.X + x) / 8 | 0;
                    let fromChunkY = (from.Y + curY) / 8 | 0;
                    let fromchunk = this.SonicLevel.GetChunkAt(fromChunkX, fromChunkY);
                    fromchunk.ClearCache();
                    fromchunk.IsOnlyBackground = null;
                    fromchunk.IsOnlyForeground = null;
                    let fromtp = fromchunk.TilePieces[(from.X + x) - fromChunkX * 8][(from.Y + curY) - fromChunkY * 8];
                    tochunk.TilePieces[(to.X + x) - toChunkX * 8][(to.Y + curY) - toChunkY * 8] = fromtp;
                    fromchunk.TilePieces[(from.X + x) - fromChunkX * 8][(from.Y + curY) - fromChunkY * 8] = totp;
                }
            },
                (from.Height - y) * 50);
        }
    }
    public CacheTiles(): void {
        console.time("tileCache");
        this.TilePaletteAnimationManager = new TilePaletteAnimationManager(this);
        this.TileAnimationManager = new TileAnimationManager(this);
        for (let chunk of this.SonicLevel.TileChunks) {
            chunk.InitCache();
            chunk.WarmCache();
        }
        console.timeEnd("tileCache");
        if (this.SonicToon != null) {
            console.time("collisionCache");
            for (let chunk of this.SonicLevel.TileChunks) {
                this.SonicToon.SensorManager.BuildChunk(chunk, false);
                this.SonicToon.SensorManager.BuildChunk(chunk, true);
            }
            console.timeEnd("collisionCache");
        }
        if (false) {
            //            this.debugDraw();
        }
    }
    private debugDraw(): void {
        let numWide: number = 10;
        let dropOffIndex: number = 0;
        let pieces: string[] = new Array<string>();
        while (true) {
            let debugCanvases: CanvasInformation[] = new Array<CanvasInformation>();
            let totalHeight: number = 0;
            let broke = false;
            for (let index: number = dropOffIndex; index < this.SonicLevel.TileChunks.length; index++) {
                let chunk = this.SonicLevel.TileChunks[index];
                let canvasCache = chunk.Debug_DrawCache();
                totalHeight += canvasCache.Canvas.height;
                debugCanvases.push(canvasCache);
                if (totalHeight > 10000) {
                    dropOffIndex = index + 1;
                    broke = true;
                    break;
                }
            }
            let bigOne = CanvasInformation.Create(numWide * 128, totalHeight, false);
            let currentPosition: number = 0;
            for (let index: number = 0; index < debugCanvases.length; index++) {
                let canvasInformation = debugCanvases[index];
                bigOne.Context.drawImage(canvasInformation.Canvas, 0, currentPosition);
                currentPosition += canvasInformation.Canvas.height;
            }
            pieces.push(bigOne.Canvas.toDataURL());
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
    /* public loadObjects(objects: KeyValuePair<string, string>[]): void {
         this.cachedObjects = {};
         this.SonicLevel.Objects.forEach(function (t) {
             let o = t.Key;
             if (this.cachedObjects.ContainsKey(o)) {
                 t.SetObjectData(this.cachedObjects[o]);
                 continue;
             }
             let d = objects.First(p => p.Key == o);
             if (d.Falsey()) {
                 t.SetObjectData(new LevelObject(o));
                 continue;
             }
             let dat: LevelObjectData;
             if (d.Value.length == 0)
                 dat = new LevelObjectData();
             else dat = <LevelObjectData>JSON.parse(d.Value);
             let dr = ObjectManager.ExtendObject(dat);
             this.cachedObjects[o] = dr;
             t.SetObjectData(dr);
         });
     }
     public loadObjects(objects: string[]): void {
         SonicEngine.Instance.client.Emit("GetObjects", objects);
     }*/
    public Load(sonicLevel: SlData): void {
        this.Loading = true;
        this.SonicLevel = new SonicLevel();
        for (let n = 0; n < sonicLevel.Rings.length; n++) {
            this.SonicLevel.Rings[n] = new Ring(true);
            this.SonicLevel.Rings[n].X = sonicLevel.Rings[n].X;
            this.SonicLevel.Rings[n].Y = sonicLevel.Rings[n].Y;
        }
        this.SonicLevel.LevelWidth = sonicLevel.ForegroundWidth;
        this.SonicLevel.LevelHeight = sonicLevel.ForegroundHeight;
        this.SonicLevel.ChunkMap = sonicLevel.Foreground;
        this.SonicLevel.BGChunkMap = sonicLevel.Background;
        for (let l: number = 0; l < sonicLevel.Objects.length; l++) {
            this.SonicLevel.Objects[l] = new LevelObjectInfo(sonicLevel.Objects[l]);
            this.SonicLevel.Objects[l].Index = l;
        }
        let objectKeys = new Array<string>();
        this.SonicLevel.Objects.forEach(function (t) {
            let o = t.Key;
            if (objectKeys.filter(p => p != o).length == objectKeys.length)
                objectKeys.push(o);
        });
        //TODO OBJECTS
        //        this.loadObjects(objectKeys);
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
            this.SonicLevel.Tiles[j] = new Tile(mfc);
            this.SonicLevel.Tiles[j].Index = j;
        }
        let acs = this.SonicLevel.AnimatedChunks = new Array<TileChunk>();
        if (sonicLevel.AnimatedFiles) {
            this.SonicLevel.AnimatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
            for (let animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                let animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                this.SonicLevel.AnimatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
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
                    tile.IsTileAnimated = true;
                    tile.Index = filePiece * 10000 + animatedFileIndex;
                    this.SonicLevel.AnimatedTileFiles[animatedFileIndex][filePiece] = tile;
                }
            }
        }
        for (let j: number = 0; j < sonicLevel.Blocks.length; j++) {
            let fc = sonicLevel.Blocks[j];
            let mj = new TilePiece();
            mj.Index = j;
            mj.Tiles = new Array<TileInfo>();
            for (let p: number = 0; p < fc.length; p++) {
                mj.Tiles.push(Help.Merge(new TileInfo(), {
                    _Tile: fc[p].Tile,
                    Index: p,
                    Palette: fc[p].Palette,
                    Priority: fc[p].Priority,
                    XFlip: fc[p].XFlip,
                    YFlip: fc[p].YFlip
                }));
            }
            mj.Init();
            this.SonicLevel.TilePieces[j] = mj;
        }
        this.SonicLevel.Angles = sonicLevel.Angles;
        this.SonicLevel.TileAnimations = sonicLevel.Animations.map(a => Help.Merge(new TileAnimationData(), {
            AnimationTileFile: a.AnimationFile,
            AnimationTileIndex: a.AnimationTileIndex,
            AutomatedTiming: a.AutomatedTiming,
            NumberOfTiles: a.NumberOfTiles,
            DataFrames: a.Frames.map(b => Help.Merge(new TileAnimationDataFrame(), { Ticks: b.Ticks, StartingTileIndex: b.StartingTileIndex })).slice(0)
        }));
        this.SonicLevel.CollisionIndexes1 = sonicLevel.CollisionIndexes1;
        this.SonicLevel.CollisionIndexes2 = sonicLevel.CollisionIndexes2;
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
                this.SonicLevel.HeightMaps[i] = HeightMap.FullHeight(false);
            else if (b2)
                this.SonicLevel.HeightMaps[i] = HeightMap.FullHeight(true);
            else this.SonicLevel.HeightMaps[i] = new HeightMap(sonicLevel.HeightMaps[i], i);
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
                mj.TilePieces[p % 8][(p / 8) | 0] = Help.Merge(new TilePieceInfo(), {
                    Index: p,
                    Block: fc[p].Block,
                    Solid1: fc[p].Solid1,
                    Solid2: fc[p].Solid2,
                    XFlip: fc[p].XFlip,
                    YFlip: fc[p].YFlip
                });
            }
            this.SonicLevel.TileChunks[j] = mj;
            mj.TileAnimations = {};
            for (let tpX: number = 0; tpX < mj.TilePieces.length; tpX++) {
                for (let tpY: number = 0; tpY < mj.TilePieces[tpX].length; tpY++) {
                    let pm = mj.TilePieces[tpX][tpY].GetTilePiece();
                    if (pm != null) {
                        for (let mjc of pm.Tiles) {
                            let fa = this.containsAnimatedTile(mjc._Tile, this.SonicLevel);
                            if (fa) {
                                mj.TileAnimations[tpY * 8 + tpX] = fa;
                                acs[j] = mj;
                            }
                        }
                    }
                }
            }
        }
        this.SonicLevel.Palette = sonicLevel.Palette.map(a => a.map(b => "#" + b));
        this.SonicLevel.StartPositions = sonicLevel.StartPositions.map(a => new Point(a.X, a.Y));
        this.SonicLevel.AnimatedPalettes = new Array<PaletteItem>();
        if (sonicLevel.PaletteItems.length > 0) {
            for (let k: number = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                let pal: AnimatedPaletteItem = sonicLevel.PaletteItems[0][k];
                this.SonicLevel.AnimatedPalettes.push(Help.Merge(new PaletteItem(), {
                    Palette: (<string[]>eval(pal.Palette)).map(b => "#" + b),
                    SkipIndex: pal.SkipIndex,
                    TotalLength: pal.TotalLength,
                    Pieces: pal.Pieces.map(a => Help.Merge(new PaletteItemPieces(), {
                        PaletteIndex: a.PaletteIndex,
                        PaletteMultiply: a.PaletteMultiply,
                        PaletteOffset: a.PaletteOffset
                    }))
                }));
            }
        }
        for (let tilePiece of this.SonicLevel.TilePieces) {
            tilePiece.AnimatedPaletteIndexes = new Array<number>();
            tilePiece.AnimatedTileIndexes = new Array<number>();
            if (this.SonicLevel.AnimatedPalettes.length > 0) {
                for (let mj of tilePiece.Tiles) {
                    let tile: Tile = mj.GetTile();
                    if (tile) {
                        tile.AnimatedPaletteIndexes = new Array<number>();
                        let pl = tile.GetAllPaletteIndexes();
                        tile.PaletteIndexesToBeAnimated = {};
                        tile.AnimatedTileIndexes = new Array<number>();
                        for (let tileAnimationIndex: number = 0; tileAnimationIndex < this.SonicLevel.TileAnimations.length; tileAnimationIndex++) {
                            let tileAnimationData = this.SonicLevel.TileAnimations[tileAnimationIndex];
                            let anin = tileAnimationData.AnimationTileIndex;
                            let num = tileAnimationData.NumberOfTiles;
                            if (tile.Index >= anin && tile.Index < anin + num) {
                                tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                tile.AnimatedTileIndexes.push(tileAnimationIndex);
                            }
                        }
                        for (let animatedPaletteIndex: number = 0; animatedPaletteIndex < this.SonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                            let pal = this.SonicLevel.AnimatedPalettes[animatedPaletteIndex];
                            tile.PaletteIndexesToBeAnimated[animatedPaletteIndex] = new Array<number>();
                            for (let mjce of pal.Pieces) {
                                let mje1: PaletteItemPieces = mjce;
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
            this.Loading = false;
        });
        this.PreloadSprites(() => {
            finished();
            this.ForceResize();
        },
            (s) => {
            });
        this.ForceResize();
        this.OnLevelLoad && this.OnLevelLoad(this.SonicLevel);
    }
}
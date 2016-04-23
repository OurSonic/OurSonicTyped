import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../Common/Utils";
import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicEngine} from "SonicEngine";
import {SonicImage} from "Level/SonicImage";
import {GameState, ClickState, ChunkLayer } from "../Common/Enums";
import {Help} from "../Common/Help";
import {Sonic} from "Sonic/Sonic";
import {HeightMap} from "Level/HeightMap";
import {ObjectManager } from "Level/Objects/ObjectManager";
import {SonicLevel}from "SonicLevel";
import {LevelObjectInfo } from "Level/Objects/LevelObjectInfo";

export class SonicManager {
    public static Instance: SonicManager;
    private static _cachedOffs: {[key:number]:Point[]} = {};
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
    public Scale: Point;
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
     
    /*[IntrinsicProperty]*/
    public TilePaletteAnimationManager: TilePaletteAnimationManager;
    /*[IntrinsicProperty]*/
    public TileAnimationManager: TileAnimationManager;
     
    constructor(engine: SonicEngine, gameCanvas: CanvasInformation, resize: () => void) {
        SonicManager.Instance = this;
        this.engine = engine;
        this.engine.canvasWidth = $(window).width();
        this.engine.canvasHeight = $(window).height();
        gameCanvas.DomCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
        gameCanvas.DomCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
        jQuery.getJSON("Content/sprites/sonic.js", (data: { [key: string]: SonicImage}) => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        var scl: number = 4;
        this.Scale = new Point(scl, scl);
        this.RealScale = new DoublePoint(1, 1);
        this.mainCanvas = gameCanvas;
        this.WindowLocation = Help.DefaultWindowLocation(GameState.Editing,  this.Scale);
        this.BigWindowLocation = Help.DefaultWindowLocation(GameState.Editing,  this.Scale);
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
        var e = new Point(<number>(<number>event.clientX / this.Scale.X / this.RealScale.X + this.WindowLocation.X),
            <number>(<number>event.clientY / this.Scale.Y / this.RealScale.Y + this.WindowLocation.Y));
        var ey: number;
        var ex: number;
        if (event.ctrlKey) {
            ex = e.X / 128;
            ey = e.Y / 128;
            var ch = this.SonicLevel.GetChunkAt(ex, ey);
//            if (this.UIManager.UIManagerAreas.TilePieceArea != null)
//                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, this.UIManager.UIManagerAreas.TilePieceArea.Data, true);
            return true;
        }
        if (event.shiftKey) {
            ex = e.X / 128;
            ey = e.Y / 128;
            var ch = this.SonicLevel.GetChunkAt(ex, ey);
//            if (this.UIManager.UIManagerAreas.TileChunkArea != null)
//                this.SonicLevel.SetChunkAt(ex, ey, this.UIManager.UIManagerAreas.TileChunkArea.Data);
            return true;
        }
        if (event.button == 0) {
            switch (this.ClickState) {
                case ClickState.Dragging:
                    return true;
                case ClickState.PlaceChunk:
                    ex = e.X / 128;
                    ey = e.Y / 128;
                    var ch  = this.SonicLevel.GetChunkAt(ex, ey);
                    var tp  = ch.GetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, true);
                    var dontClear: boolean = false;
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
                    var pos = new Point(ex, ey);
                    for (var o of this.SonicLevel.Objects) {
                        if (IntersectingRectangle.IntersectsRect(o.GetRect(), pos))
                            alert("Object Data: " + Help.Stringify(o));
                    }
                    return true;
            }
        }
        return false;
    }
    private tickObjects(): void {
        var localPoint = new Point(0, 0);
        this.InFocusObjects = new Array<LevelObjectInfo>();
        var levelObjectInfos = this.SonicLevel.Objects;
        for (var obj of levelObjectInfos) {
            localPoint.X = <number>obj.X;
            localPoint.Y = <number>obj.Y;
            if (this.BigWindowLocation.Intersects(localPoint)) {
                this.InFocusObjects.push(obj);
                obj.Tick(obj, this.SonicLevel, this.SonicToon);
            }
        }
//        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
//            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
        for (var animationInstance of this.AnimationInstances) {
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
        var ci = this.SpriteCache.Rings;
        var spriteLocations = new Array<string>();
        for (var j: number = 0; j < 4; j++) {
            spriteLocations.push(`assets/Sprites/ring${j}.png`);
            this.imageLength++;
        }
        var ind_ = this.SpriteCache.Indexes;
        this.SpriteLoader = new SpriteLoader(completed, update);
        if (ci.Count == 0) {
            var spriteStep = this.SpriteLoader.AddStep("Sprites",
                (i, done) => {
                    Help.LoadSprite(spriteLocations[i],
                        jd => {
                            ci[i] = CanvasInformation.Create(jd.width, jd.height, false);
                            ci[i].Context.DrawImage(jd, 0, 0);
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
            for (var i = 0; i < spriteLocations.length; i++) {
                this.SpriteLoader.AddIterationToStep(spriteStep, i);
            }
        }
        var cci = this.SpriteCache.SonicSprites;
        if (cci.Count == 0) {
            var sonicStep = this.SpriteLoader.AddStep("Sonic Sprites",
                (sp, done) => {
                    for (var sonicSprite in this.sonicSprites) {
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
        var context = canvas.Context;
        if (this.InHaltMode)
            if (this.drawHaltMode(context))
                return
        this.engine.Clear(canvas);
        if (this.SonicLevel == null)
            return
        context.save();
        var localPoint = new Point(0, 0);
        this.DrawTickCount++;
        if (this.SpriteLoader.Truthy() && !this.SpriteLoader.Tick() || this.Loading) {
            SonicManager. drawLoading(context);
            context.restore();
            return;
        }
        this.updatePositions(context);
        var w1: number = this.WindowLocation.Width / 128 + 2;
        var h1: number = this.WindowLocation.Height / 128 + 2;
        if (this.CurrentGameState == GameState.Editing) {
            w1 += 1;
            h1 += 1;
            w1 /= this.Scale.X;
            h1 /= this.Scale.Y;
        }
        var offs = SonicManager.getOffs(w1, h1);
        this.TilePaletteAnimationManager.TickAnimatedPalettes();
        this.TileAnimationManager.TickAnimatedTiles();
        var fxP: number = <number>((this.WindowLocation.X) / 128.0);
        var fyP: number = <number>((this.WindowLocation.Y) / 128.0);
        this.ResetCanvases();
        var zero = new Point(0, 0);
        if (this.Background.Truthy()) {
            var wOffset: number = this.WindowLocation.X;
            var bw: number = this.Background.Width;
            var movex: number = (wOffset / bw) * bw;
            localPoint.X = -this.WindowLocation.X + movex;
            localPoint.Y = -this.WindowLocation.Y / 4;
            this.Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
            localPoint.X = -this.WindowLocation.X + movex + this.Background.Width;
            localPoint.Y = -this.WindowLocation.Y / 4;
            this.Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
        }
        this.drawLowChunks(this.lowChunkCanvas.Context, zero, offs, fyP, fxP);
        if (this.ShowHeightMap)
            this.   drawHighChunks(this.lowChunkCanvas.Context, fxP, fyP, offs, zero);
        this. drawObjects(this.sonicCanvas.Context, zero);
        this. drawAnimations(this.sonicCanvas.Context);
        this. drawRings(this.sonicCanvas.Context, zero);
        this. drawSonic(this.sonicCanvas.Context);
        if (!this.ShowHeightMap)
            this.  drawHighChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        this.  drawDebugTextChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
//        this.lowChunkCanvas.Context.OffsetPixelsForWater();
//        this.highChuckCanvas.Context.OffsetPixelsForWater();
        this.  drawCanveses(context, localPoint);
        context.restore();
        if (this.CurrentGameState == GameState.Playing)
            this.SonicToon.DrawUI(context, new Point(this.ScreenOffset.X, this.ScreenOffset.Y));
    }
    private drawCanveses(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        canvas.scale(this.Scale.X, this.Scale.Y);
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
        var hash: number = (w1 + 1) * (h1 + 1);
        if (SonicManager._cachedOffs[hash])
            return SonicManager._cachedOffs[hash];
        var offs = new Array(0);
        var ca = 0;
        for (var y: number = -1; y < h1; y++)
            for (var x: number = -1; x < w1; x++)
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
        for (var off of offs) {
            var _xP: number = fxP + off.X;
            var _yP: number = fyP + off.Y;
            var _xPreal: number = fxP + off.X;
            var _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.SonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.SonicLevel.LevelHeight);
            var chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - this.WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - this.WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                chunk.Draw(canvas, localPoint, ChunkLayer.Low);
        }
    }
    private drawHighChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
        for (var off of offs) {
            var _xP: number = fxP + off.X;
            var _yP: number = fyP + off.Y;
            var _xPreal: number = fxP + off.X;
            var _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.SonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.SonicLevel.LevelHeight);
            var chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - this.WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - this.WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                chunk.Draw(canvas, localPoint, ChunkLayer.High);
            if (this.ShowHeightMap) {
                var fd = this.SpriteCache.HeightMapChunks[(this.SonicLevel.CurHeightMap ? 1 : 2) + " " + chunk.Index];
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
        for (var off of offs) {
            var _xP: number = fxP + off.X;
            var _yP: number = fyP + off.Y;
            var _xPreal: number = fxP + off.X;
            var _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.SonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.SonicLevel.LevelHeight);
            var chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - this.WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - this.WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayer.Low, this.TileChunkDebugDrawOptions);
            if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayer.High, this.TileChunkDebugDrawOptions);
        }
    }
    private cacheHeightMapForChunk(chunk: TileChunk): CanvasInformation {
        var md = chunk;
        var posj1 = new Point(0, 0);
        var canv = CanvasInformation.Create(128, 128, false);
        var ctx = canv.Context;
        this.engine.Clear(canv);
        for (var _y = 0; _y < 8; _y++) {
            for (var _x = 0; _x < 8; _x++) {
                var tp = md.TilePieces[_x][_y];
                var solid = <number>(this.SonicLevel.CurHeightMap ? tp.Solid1 : tp.Solid2);
                var hd = this.SonicLevel.CurHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
                var __x = _x;
                var __y = _y;
                var vangle = 0;
                var posm = new Point(posj1.X + (__x * 16), posj1.Y + (__y * 16));
                if (hd.Falsey())
                    continue;
                if (hd.Full == false) {

                }
                else if (hd.Full == true) {
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
        for (var index: number = 0; index < this.SonicLevel.Rings.length; index++) {
            var r = this.SonicLevel.Rings[index];
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
                for (var i: number = this.ActiveRings.length - 1; i >= 0; i--) {
                    var ac: Ring = this.ActiveRings[i];
                    localPoint.X = ac.X - this.WindowLocation.X;
                    localPoint.Y = ac.Y - this.WindowLocation.Y;
                    ac.Draw(canvas, localPoint);
                    if (ac.TickCount > 256)
                        this.ActiveRings.splice(i,1);
                }
                break;
            case GameState.Editing:
                break;
        }
    }
    private drawAnimations(canvas: CanvasRenderingContext2D): void {
        for (var ano of this.AnimationInstances) {
            ano.Draw(canvas, -this.WindowLocation.X, -this.WindowLocation.Y);
        }
    }
    private drawObjects(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        var levelObjectInfos: LevelObjectInfo[] = this.SonicLevel.Objects;
        for (var o of levelObjectInfos) {
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
        for (var an of sonLevel.TileAnimations) {
            var anin = an.AnimationTileIndex;
            var num = an.NumberOfTiles;
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
        for (var y: number = from.Height; y >= 0; y--) {
            var curY: number = y;
            window.setTimeout(() => {
                for (var x: number = 0; x < from.Width; x++) {
                    var toChunkX = (to.X + x) / 8;
                    var toChunkY = (to.Y + curY) / 8;
                    var tochunk = this.SonicLevel.GetChunkAt(toChunkX, toChunkY);
                    tochunk.ClearCache();
                    var totp = tochunk.TilePieces[(to.X + x) - toChunkX * 8][(to.Y + curY) - toChunkY * 8];
                    tochunk.IsOnlyBackground = null;
                    tochunk.IsOnlyForeground = null;
                    var fromChunkX = (from.X + x) / 8;
                    var fromChunkY = (from.Y + curY) / 8;
                    var fromchunk = this.SonicLevel.GetChunkAt(fromChunkX, fromChunkY);
                    fromchunk.ClearCache();
                    fromchunk.IsOnlyBackground = null;
                    fromchunk.IsOnlyForeground = null;
                    var fromtp = fromchunk.TilePieces[(from.X + x) - fromChunkX * 8][(from.Y + curY) - fromChunkY * 8];
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
        for (var chunk of this.SonicLevel.TileChunks) {
            chunk.InitCache();
            chunk.WarmCache();
        }
        console.timeEnd("tileCache");
        if (this.SonicToon != null) {
            console.time("collisionCache");
            for (var chunk of this.SonicLevel.TileChunks) {
                this.SonicToon.SensorManager.BuildChunk(chunk, false);
                this.SonicToon.SensorManager.BuildChunk(chunk, true);
            }
            console.timeEnd("collisionCache");
        }
        if (false) {
            this.debugDraw();
        }
    }
    private debugDraw(): void {
        var numWide: number = 10;
        var dropOffIndex: number = 0;
        var pieces: string[] = new Array<string>();
        while (true) {
            var debugCanvases: CanvasInformation[] = new Array<CanvasInformation>();
            var totalHeight: number = 0;
            var broke = false;
            for (var index: number = dropOffIndex; index < this.SonicLevel.TileChunks.Count; index++) {
                var chunk = this.SonicLevel.TileChunks[index];
                var canvasCache = chunk.Debug_DrawCache();
                totalHeight += canvasCache.Canvas.Height;
                debugCanvases.push(canvasCache);
                if (totalHeight > 10000) {
                    dropOffIndex = index + 1;
                    broke = true;
                    break;
                }
            }
            var bigOne = CanvasInformation.Create(numWide * 128, totalHeight, false);
            var currentPosition: number = 0;
            for (var index: number = 0; index < debugCanvases.length; index++) {
                var canvasInformation = debugCanvases[index];
                bigOne.Context.drawImage(canvasInformation.Canvas, 0, currentPosition);
                currentPosition += canvasInformation.Canvas.height;
            }
            pieces.push(bigOne.Canvas.toDataURL());
            if (!broke)
                break;
        }
        var str = "<html><body>";
        for (var piece of pieces) {
            str += "<img src=\"" + piece + "\"/>\n";
        }
        str += "</body></html>";
        var tx = document.createElement("textarea");
        tx.style.position = "absolute";
        tx.value = str;
        document.body.appendChild(tx);
    }
}
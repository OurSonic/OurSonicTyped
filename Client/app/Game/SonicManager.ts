import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../Common/Utils";
import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicEngine} from "SonicEngine";
import {SonicImage} from "Level/SonicImage";
import {GameState, ClickState } from "../Common/Enums";
import {Help} from "../Common/Help";
import {Sonic} from "Sonic/Sonic";

export class SonicManager {
    public static instance: SonicManager;
    private static _cachedOffs: { [width: number]: Point[] } = {};
    public mainCanvas: CanvasInformation;
    private engine: SonicEngine;
    public objectManager: ObjectManager;
    public drawTickCount: number;
    private clicking: boolean;
    private imageLength: number;
    public overrideRealScale: DoublePoint;
    private sonicSprites: { [key: string]: SonicImage };
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
    public sonicLevel: this.sonicLevel;
    public inFocusObjects: LevelObjectInfo[];
    protected loading: boolean;
    public spriteCache: SpriteCache;
    protected spriteLoader: SpriteLoader;
    public onLevelLoad: (_: this.sonicLevel) => void;
    public tileChunkDebugDrawOptions: TileChunkDebugDrawOptions;
 
    public tilePaletteAnimationManager: TilePaletteAnimationManager;
    public tileAnimationManager: TileAnimationManager;

    constructor(engine: SonicEngine, gameCanvas: CanvasInformation, resize: () => void) {
        this.engine = engine;
        this.engine.canvasWidth = $(window).width();
        this.engine.canvasHeight = $(window).height();
        gameCanvas.domCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
        gameCanvas.domCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
        jQuery.getJSON("Content/sprites/sonic.js", (data: { [key: string]: SonicImage}) => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        var scl: number = 4;
        this.mainCanvas = gameCanvas;
        this.scale = new Point(scl, scl);
        this.realScale = new DoublePoint(1, 1);
        this.windowLocation = engine.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation = engine.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation.width = <number>(this.bigWindowLocation.width * 1.8);
        this.bigWindowLocation.height = <number>(this.bigWindowLocation.height * 1.8);
        this.tileAnimations = [];
        this.animationInstances = [];
        this.showHeightMap = false;
        this.goodRing = new Ring(false);
        this.activeRings = [];
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
        var e = new Point(<number>(<number>event.ClientX / scale.X / realScale.X + WindowLocation.X),
            <number>(<number>event.ClientY / scale.Y / realScale.Y + WindowLocation.Y));
        var ey: number;
        var ex: number;
        if (event.CtrlKey) {
            ex = e.X / 128;
            ey = e.Y / 128;
            var ch: TileChunk = this.sonicLevel.getChunkAt(ex, ey);
            if (UIManager.UIManagerAreas.TilePieceArea != null)
                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, UIManager.UIManagerAreas.TilePieceArea.Data, true);
            return true;
        }
        if (event.ShiftKey) {
            ex = e.X / 128;
            ey = e.Y / 128;
            var ch: TileChunk = this.sonicLevel.getChunkAt(ex, ey);
            if (UIManager.UIManagerAreas.TileChunkArea != null)
                this.sonicLevel.SetChunkAt(ex, ey, UIManager.UIManagerAreas.TileChunkArea.Data);
            return true;
        }
        if (event.Button == 0) {
            switch (ClickState) {
                case ClickState.Dragging:
                    return true;
                case ClickState.PlaceChunk:
                    ex = e.X / 128;
                    ey = e.Y / 128;
                    var ch: TileChunk = this.sonicLevel.getChunkAt(ex, ey);
                    var tp: TilePiece = ch.GetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, true);
                    var dontClear: boolean = false;
                    if (UIManager.UIManagerAreas.TileChunkArea != null) {
                        if (UIManager.UIManagerAreas.TileChunkArea.Data == ch)
                            dontClear = true;
                        UIManager.UIManagerAreas.TileChunkArea.Data = ch;
                    }
                    if (UIManager.UIManagerAreas.TilePieceArea != null) {
                        if (UIManager.UIManagerAreas.TilePieceArea.Data != tp)
                            dontClear = true;
                        UIManager.UIManagerAreas.TilePieceArea.Data = tp;
                    }
                    ClearCache();
                    return true;
                case ClickState.PlaceRing:
                    ex = e.X;
                    ey = e.Y;
                    this.sonicLevel.Rings.Add(__init(new Ring(true), { X: ex, Y: ey }));
                    return true;
                case ClickState.PlaceObject:
                    ex = e.X;
                    ey = e.Y;
                    var pos = new Point(ex, ey);
                    this.sonicLevel.Objects.forEach(function (o) {
                        if (IntersectingRectangle.IntersectsRect(o.GetRect(), pos))
                            Window.Alert("Object Data: " + Help.Stringify(o));
                    });
                    return true;
            }
        }
        return false;
    }
    private tickObjects(): void {
        var localPoint = new Point(0, 0);
        this.inFocusObjects = [];
        var levelObjectInfos = this.sonicLevel.Objects;
        levelObjectInfos.forEach(function (obj) {
            localPoint.X = <number>obj.X;
            localPoint.Y = <number>obj.Y;
            if (BigWindowLocation.Intersects(localPoint)) {
                InFocusObjects.Add(obj);
                obj.Tick(obj, this.sonicLevel, SonicToon);
            }
        });
        if (UIManager.UIManagerAreas.LiveObjectsArea != null)
            UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(InFocusObjects);
        AnimationInstances.forEach(function (animationInstance) {
            animationInstance.Tick();
        });
    }
    public tick(): void {
        if (this.loading)
            return
        if (this.currentGameState == GameState.Playing) {
            if (this.inHaltMode) {
                if (this.waitingForTickContinue)
                    return
            }
            this.tickCount++;
            this.tickObjects();
            this.sonicToon.Ticking = true;
            try {
                this.sonicToon.Tick(this.sonicLevel);
            }

            finally {
                this.sonicToon.Ticking = false;
            }
            if (this.inHaltMode) {
                if (this.waitingForTickContinue)
                    return
                this.waitingForTickContinue = true;
                this.waitingForDrawContinue = false;
            }
        }
    }
    public preloadSprites(completed: () => void, update: (_: string) => void): void {
        if (SpriteCache != null) {
            completed();
            return
        }
        SpriteCache = SpriteCache != null ? SpriteCache : new SpriteCache();
        var ci = SpriteCache.Rings;
        var spriteLocations = new Array<string>();
        for (var j: number = 0; j < 4; j++) {
            spriteLocations.Add(string.Format("assets/Sprites/ring{0}.png", j));
            this.imageLength++;
        }
        var ind_ = SpriteCache.Indexes;
        SpriteLoader = new SpriteLoader(completed, update);
        if (ci.Count == 0) {
            var spriteStep = SpriteLoader.AddStep("Sprites",
                (i, done) => {
                    Help.LoadSprite(spriteLocations[i],
                        jd => {
                            ci[i] = CanvasInformation.Create(jd.Width, jd.Height, false);
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
            for (var i = 0; i < spriteLocations.Count; i++) {
                SpriteLoader.AddIterationToStep(spriteStep, i);
            }
        }
        var cci = SpriteCache.SonicSprites;
        if (cci.Count == 0) {
            var sonicStep = SpriteLoader.AddStep("Sonic Sprites",
                (sp, done) => {
                    this.sonicSprites.forEach(function (sonicSprite) {
                        cci[sonicSprite.Key] = Help.ScaleCsImage(sonicSprite.Value, new Point(1, 1), (ec) => {

                        });
                    });
                    done();
                },
                () => true,
                false);
            SpriteLoader.AddIterationToStep(sonicStep, 0);
        }
    }
    public mainDraw(canvas: CanvasInformation): void {
        var context = canvas.Context;
        if (InHaltMode)
            if (drawHaltMode(context))
                return
        this.engine.Clear(canvas);
        if (this.sonicLevel == null)
            return
        context.Save();
        var localPoint = new Point(0, 0);
        DrawTickCount++;
        if (SpriteLoader.Truthy() && !SpriteLoader.Tick() || Loading) {
            drawLoading(context);
            context.Restore();
            return
        }
        updatePositions(context);
        var w1: number = WindowLocation.Width / 128 + 2;
        var h1: number = WindowLocation.Height / 128 + 2;
        if (CurrentGameState == GameState.Editing) {
            w1 += 1;
            h1 += 1;
            w1 /= scale.X;
            h1 /= scale.Y;
        }
        var offs = SonicManager.getOffs(w1, h1);
        TilePaletteAnimationManager.TickAnimatedPalettes();
        TileAnimationManager.TickAnimatedTiles();
        var fxP: number = <number>((WindowLocation.X) / 128.0);
        var fyP: number = <number>((WindowLocation.Y) / 128.0);
        ResetCanvases();
        var zero = new Point(0, 0);
        if (Background.Truthy()) {
            var wOffset: number = WindowLocation.X;
            var bw: number = Background.Width;
            var movex: number = (wOffset / bw) * bw;
            localPoint.X = -WindowLocation.X + movex;
            localPoint.Y = -WindowLocation.Y / 4;
            Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
            localPoint.X = -WindowLocation.X + movex + Background.Width;
            localPoint.Y = -WindowLocation.Y / 4;
            Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
        }
        drawLowChunks(this.lowChunkCanvas.Context, zero, offs, fyP, fxP);
        if (ShowHeightMap)
            drawHighChunks(this.lowChunkCanvas.Context, fxP, fyP, offs, zero);
        drawObjects(this.sonicCanvas.Context, zero);
        drawAnimations(this.sonicCanvas.Context);
        drawRings(this.sonicCanvas.Context, zero);
        drawSonic(this.sonicCanvas.Context);
        if (!ShowHeightMap)
            drawHighChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        drawDebugTextChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
        this.lowChunkCanvas.Context.OffsetPixelsForWater();
        this.highChuckCanvas.Context.OffsetPixelsForWater();
        drawCanveses(context, localPoint);
        context.Restore();
        if (CurrentGameState == GameState.Playing)
            SonicToon.DrawUI(context, new Point(ScreenOffset.X, ScreenOffset.Y));
    }
    private drawCanveses(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        canvas.scale(scale.X, scale.Y);
        canvas.DrawImage(this.lowChunkCanvas.Canvas, localPoint.X, localPoint.Y);
        canvas.DrawImage(this.sonicCanvas.Canvas, localPoint.X, localPoint.Y);
        canvas.DrawImage(this.highChuckCanvas.Canvas, localPoint.X, localPoint.Y);
    }
    public resetCanvases(): void {
        this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation.Create(WindowLocation.Width, WindowLocation.Height, false);
        this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation.Create(WindowLocation.Width, WindowLocation.Height, true);
        this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation.Create(WindowLocation.Width, WindowLocation.Height, false);
        this.sonicCanvas.Context.ClearRect(0, 0, WindowLocation.Width, WindowLocation.Height);
        this.highChuckCanvas.Context.ClearRect(0, 0, WindowLocation.Width, WindowLocation.Height);
        this.lowChunkCanvas.Context.ClearRect(0, 0, WindowLocation.Width, WindowLocation.Height);
    }
    public destroyCanvases(): void {
        this.lowChunkCanvas = null;
        this.sonicCanvas = null;
        this.highChuckCanvas = null;
    }
    private static getOffs(w1: number, h1: number): Point[] {
        var hash: number = (w1 + 1) * (h1 + 1);
        if (SonicManager._cachedOffs.ContainsKey(hash))
            return SonicManager._cachedOffs[hash];
        var offs = new Array(0);
        var ca = 0;
        for (var y: number = -1; y < h1; y++)
            for (var x: number = -1; x < w1; x++)
                offs[ca++] = (new Point(x, y));
        return SonicManager._cachedOffs[hash] = offs;
    }
    private updatePositions(canvas: CanvasRenderingContext2D): void {
        ScreenOffset.X = 0;
        ScreenOffset.Y = 0;
        if (CurrentGameState == GameState.Playing)
            this.updatePositionsForPlaying(canvas);
    }
    private updatePositionsForPlaying(canvas: CanvasRenderingContext2D): void {
        canvas.scale(realScale.X, realScale.Y);
        if (SonicToon.Ticking) {
            while (true) {
                if (SonicToon.Ticking)
                    break;
            }
        }
        canvas.Translate(ScreenOffset.X, ScreenOffset.Y);
        WindowLocation.X = <number>(SonicToon.X) - WindowLocation.Width / 2;
        WindowLocation.Y = <number>(SonicToon.Y) - WindowLocation.Height / 2;
        BigWindowLocation.X = <number>(SonicToon.X) - BigWindowLocation.Width / 2;
        BigWindowLocation.Y = <number>(SonicToon.Y) - BigWindowLocation.Height / 2;
        BigWindowLocation.X = <number>(BigWindowLocation.X - WindowLocation.Width * 0.2);
        BigWindowLocation.Y = <number>(BigWindowLocation.Y - WindowLocation.Height * 0.2);
        BigWindowLocation.Width = <number>(WindowLocation.Width * 1.8);
        BigWindowLocation.Height = <number>(WindowLocation.Height * 1.8);
    }
    private static drawLoading(canvas: CanvasRenderingContext2D): void {
        canvas.FillStyle = "white";
        canvas.FillText("Loading...   ", 95, 95);
        canvas.Restore();
        return
    }
    private drawHaltMode(canvas: CanvasRenderingContext2D): boolean {
        canvas.FillStyle = "white";
        canvas.Font = "21pt arial bold";
        canvas.FillText("HALT MODE\r\n Press: P to step\r\n        O to resume", 10, 120);
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
            _xP = Help.Mod(_xP, this.sonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.sonicLevel.LevelHeight);
            var chunk: TileChunk = this.sonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - WindowLocation.Y;
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
            _xP = Help.Mod(_xP, this.sonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.sonicLevel.LevelHeight);
            var chunk: TileChunk = this.sonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                chunk.Draw(canvas, localPoint, ChunkLayer.High);
            if (ShowHeightMap) {
                var fd = SpriteCache.HeightMapChunks[(this.sonicLevel.CurHeightMap ? 1 : 2) + " " + chunk.Index];
                if (fd == null) {
                    fd = this.cacheHeightMapForChunk(chunk);
                }
                canvas.DrawImage(fd.Canvas, localPoint.X, localPoint.Y);
            }
            if (CurrentGameState == GameState.Editing) {
                canvas.StrokeStyle = "#DD0033";
                canvas.LineWidth = 3;
                canvas.StrokeRect(localPoint.X, localPoint.Y, 128, 128);
            }
        }
    }
    private drawDebugTextChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
        for (var off of offs) {
            var _xP: number = fxP + off.X;
            var _yP: number = fyP + off.Y;
            var _xPreal: number = fxP + off.X;
            var _yPreal: number = fyP + off.Y;
            _xP = Help.Mod(_xP, this.sonicLevel.LevelWidth);
            _yP = Help.Mod(_yP, this.sonicLevel.LevelHeight);
            var chunk: TileChunk = this.sonicLevel.GetChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.X = (_xPreal * 128) - WindowLocation.X;
            localPoint.Y = (_yPreal * 128) - WindowLocation.Y;
            if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayer.Low, TileChunkDebugDrawOptions);
            if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                chunk.DrawAnimationDebug(canvas, localPoint, ChunkLayer.High, TileChunkDebugDrawOptions);
        };
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
                var solid = <number>(this.sonicLevel.CurHeightMap ? tp.Solid1 : tp.Solid2);
                var hd = this.sonicLevel.CurHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
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
                        ctx.FillStyle = HeightMap.colors[solid];
                        ctx.FillRect(posj1.X + (__x * 16),
                            posj1.Y + (__y * 16),
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
        return SpriteCache.HeightMapChunks[(this.sonicLevel.CurHeightMap ? 1 : 2) + " " + md.Index] = canv;
    }
    private drawSonic(canvas: CanvasRenderingContext2D): void {
        if (CurrentGameState == GameState.Playing) {
            SonicToon.Draw(canvas);
        }
    }
    private drawRings(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        for (var index: number = 0; index < this.sonicLevel.Rings.Count; index++) {
            var r = this.sonicLevel.Rings[index];
            switch (CurrentGameState) {
                case GameState.Playing:
                    if (!SonicToon.obtainedRing[index]) {
                        if (BigWindowLocation.Intersects(r))
                            GoodRing.Draw(canvas, r.Negate(WindowLocation.X, WindowLocation.Y));
                    }
                    break;
                case GameState.Editing:
                    if (BigWindowLocation.Intersects(r))
                        GoodRing.Draw(canvas, r.Negate(WindowLocation.X, WindowLocation.Y));
                    break;
            }
        }
        switch (CurrentGameState) {
            case GameState.Playing:
                for (var i: number = ActiveRings.Count - 1; i >= 0; i--) {
                    var ac: Ring = ActiveRings[i];
                    localPoint.X = ac.X - WindowLocation.X;
                    localPoint.Y = ac.Y - WindowLocation.Y;
                    ac.Draw(canvas, localPoint);
                    if (ac.TickCount > 256)
                        ActiveRings.Remove(ac);
                }
                break;
            case GameState.Editing:
                break;
        }
    }
    private drawAnimations(canvas: CanvasRenderingContext2D): void {
        AnimationInstances.forEach(function (ano) {
            ano.Draw(canvas, -WindowLocation.X, -WindowLocation.Y);
        });
    }
    private drawObjects(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        var levelObjectInfos: LevelObjectInfo[] = this.sonicLevel.Objects;
        levelObjectInfos.forEach(function (o) {
            localPoint.X = Script.Reinterpret<number>(o.X);
            localPoint.Y = Script.Reinterpret<number>(o.Y);
            if (o.Dead || BigWindowLocation.Intersects(localPoint)) {
                o.Draw(canvas,
                    ((localPoint.X - WindowLocation.X)),
                    ((localPoint.Y - WindowLocation.Y)),
                    ShowHeightMap);
            }
        });
    }
    private containsAnimatedTile(tile: number, sonLevel: SonicLevel): TileAnimationData {
        for (var an of sonLevel.TileAnimations){
            var anin = an.AnimationTileIndex;
            var num = an.NumberOfTiles;
            if (tile >= anin && tile < anin + num)
                return an;

}
        return null;
    }
    public clearCache(): void {
        if (SpriteCache != null)
            SpriteCache.ClearCache();
        if (this.sonicLevel != null)
            this.sonicLevel.ClearCache();
        if (TilePaletteAnimationManager != null)
            TilePaletteAnimationManager.ClearCache();
        if (TileAnimationManager != null)
            TileAnimationManager.ClearCache();
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
    public replaceMagic(): void {
        Replace(new Rectangle(0, 0, 15, 30), new Point(712, 40));
    }
    public replace(from: Rectangle, to: Point): void {
        for (var y: number = from.Height; y >= 0; y--) {
            var curY: number = y;
            Window.SetTimeout(() => {
                for (var x: number = 0; x < from.Width; x++) {
                    var toChunkX = (to.X + x) / 8;
                    var toChunkY = (to.Y + curY) / 8;
                    var tochunk = this.sonicLevel.GetChunkAt(toChunkX, toChunkY);
                    tochunk.ClearCache();
                    var totp = tochunk.TilePieces[(to.X + x) - toChunkX * 8][(to.Y + curY) - toChunkY * 8];
                    tochunk.IsOnlyBackground = null;
                    tochunk.IsOnlyForeground = null;
                    var fromChunkX = (from.X + x) / 8;
                    var fromChunkY = (from.Y + curY) / 8;
                    var fromchunk = this.sonicLevel.GetChunkAt(fromChunkX, fromChunkY);
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
    public cacheTiles(): void {
        Console.Time("tileCache");
        TilePaletteAnimationManager = new TilePaletteAnimationManager(this);
        TileAnimationManager = new TileAnimationManager(this);
        this.sonicLevel.TileChunks.forEach(function (chunk) {
            chunk.InitCache();
            chunk.WarmCache();
        });
        Console.TimeEnd("tileCache");
        if (SonicToon != null) {
            Console.Time("collisionCache");
            this.sonicLevel.TileChunks.forEach(function (chunk) {
                SonicToon.SensorManager.BuildChunk(chunk, false);
                SonicToon.SensorManager.BuildChunk(chunk, true);
            });
            Console.TimeEnd("collisionCache");
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
            for (var index: number = dropOffIndex; index < this.sonicLevel.TileChunks.Count; index++) {
                var chunk = this.sonicLevel.TileChunks[index];
                var canvasCache = chunk.Debug_DrawCache();
                totalHeight += canvasCache.Canvas.Height;
                debugCanvases.Add(canvasCache);
                if (totalHeight > 10000) {
                    dropOffIndex = index + 1;
                    broke = true;
                    break;
                }
            }
            var bigOne = CanvasInformation.Create(numWide * 128, totalHeight, false);
            var currentPosition: number = 0;
            for (var index: number = 0; index < debugCanvases.Count; index++) {
                var canvasInformation = debugCanvases[index];
                bigOne.Context.DrawImage(canvasInformation.Canvas, 0, currentPosition);
                currentPosition += canvasInformation.Canvas.Height;
            }
            pieces.Add(bigOne.Canvas.Me().toDataURL());
            if (!broke)
                break;
        }
        var str = "<html><body>";
        pieces.forEach(function (piece) {
            str += "<img src=\"" + piece + "\"/>\n";
        });
        str += "</body></html>";
        var tx = <TextAreaElement>Window.Document.CreateElement("textarea");
        tx.Style.Position = "absolute";
        tx.Value = str;
        Window.Document.Body.AppendChild(tx);
    }
}
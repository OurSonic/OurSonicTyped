import {Point, DoublePoint, IntersectingRectangle, Rectangle} from "../Common/Utils";
import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicEngine} from "SonicEngine";
import {SonicImage} from "Level/SonicImage";
import {GameState, ClickState, ChunkLayer } from "../Common/Enums";
import {Help} from "../Common/Help";
import {Sonic} from "Sonic/Sonic";
import {HeightMap} from "Level/HeightMap";
import {ObjectManager } from "Level/Objects/ObjectManager";

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
    public sonicLevel: SonicLevel;
    public inFocusObjects: LevelObjectInfo[];
    protected loading: boolean;
    public spriteCache: SpriteCache;
    protected spriteLoader: SpriteLoader;
    public onLevelLoad: (_: SonicLevel) => void;
    public tileChunkDebugDrawOptions: TileChunkDebugDrawOptions;

    /*[IntrinsicProperty]*/
    public tilePaletteAnimationManager: TilePaletteAnimationManager;
    /*[IntrinsicProperty]*/
    public tileAnimationManager: TileAnimationManager;
    constructor(engine: SonicEngine, gameCanvas: CanvasInformation, resize: () => void) {
        SonicManager.instance = this;
        this.engine = engine;
        this.engine.canvasWidth = jQuery.window.getWidth();
        this.engine.canvasHeight = jQuery.window.getHeight();
        gameCanvas.domCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
        gameCanvas.domCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
        jQuery.GetJsonData<JsDictionary<string, sonicImage>>("Content/sprites/sonic.js", data => {
            this.sonicSprites = data;
        });
        this.objectManager = new ObjectManager(this);
        this.objectManager.init();
        var scl: number = 4;
        this.scale = new Point(scl, scl);
        this.realScale = new DoublePoint(1, 1);
        this.mainCanvas = gameCanvas;
        this.windowLocation = this.engine.defaultWindowLocation(GameState.Editing, this.scale);
        this.bigWindowLocation = this.engine.defaultWindowLocation(GameState.Editing, this.scale);
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
        var e = new Point((event.clientX / this.scale.x / this.realScale.x + this.windowLocation.x), (event.clientY / this.scale.y / this.realScale.y + this.windowLocation.y));
        var ey: number;
        var ex: number;
        if (event.ctrlKey) {
            ex = e.x / 128;
            ey = e.y / 128;
            var ch = this.sonicLevel.getChunkAt(ex, ey);
            //            if (this.uIManager.uIManagerAreas.tilePieceArea != null)
            //                ch.setTilePieceAt(e.x - ex * 128, e.y - ey * 128, this.uIManager.uIManagerAreas.tilePieceArea.data, true);
            return true;
        }
        if (event.shiftKey) {
            ex = e.x / 128;
            ey = e.y / 128;
            var ch = this.sonicLevel.getChunkAt(ex, ey);
            //            if (this.uIManager.uIManagerAreas.tileChunkArea != null)
            //                this.sonicLevel.setChunkAt(ex, ey, this.uIManager.uIManagerAreas.tileChunkArea.data);
            return true;
        }
        if (event.button == 0) {
            switch (this.clickState) {
                case ClickState.Dragging:
                    return true;
                case ClickState.PlaceChunk:
                    ex = e.x / 128;
                    ey = e.y / 128;
                    var ch = this.sonicLevel.getChunkAt(ex, ey);
                    var tp = ch.getTilePieceAt(e.x - ex * 128, e.y - ey * 128, true);
                    var dontClear: boolean = false;
                    /*   if (this.uIManager.uIManagerAreas.tileChunkArea != null) {
                           if (this.uIManager.uIManagerAreas.tileChunkArea.data == ch)
                               dontClear = true;
                           this.uIManager.uIManagerAreas.tileChunkArea.data = ch;
                       }
                       if (this.uIManager.uIManagerAreas.tilePieceArea != null) {
                           if (this.uIManager.uIManagerAreas.tilePieceArea.data != tp)
                               dontClear = true;
                           this.uIManager.uIManagerAreas.tilePieceArea.data = tp;
                       }*/
                    this.clearCache();
                    return true;
                case ClickState.PlaceRing:
                    ex = e.x;
                    ey = e.y;
                    this.sonicLevel.rings.add(Help.merge(new Ring(true), { x: ex, y: ey }));
                    return true;
                case ClickState.PlaceObject:
                    ex = e.x;
                    ey = e.y;
                    var pos = new Point(ex, ey);
                    for (var o of this.sonicLevel.objects) { 2 }
                    return true;
            }
        }
        return false;
    }
    private tickObjects(): void {
        var localPoint = new Point(0, 0);
        this.inFocusObjects = [];
        var levelObjectInfos = this.sonicLevel.objects;
        for (var obj of levelObjectInfos) {
            localPoint.x = <number>obj.x;
            localPoint.y = <number>obj.y;
            if (this.bigWindowLocation.intersects(localPoint)) {
                this.inFocusObjects.push(obj);
                obj.tick(obj, this.sonicLevel, this.sonicToon);
            }
        }
//        if (this.uIManager.uIManagerAreas.liveObjectsArea != null)
//            this.uIManager.uIManagerAreas.liveObjectsArea.data.populate(this.inFocusObjects);
        for (var animationInstance of this.animationInstances) {
            animationInstance.tick();
        }
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
    public preloadSprites(completed: () => void, update: (_: string) => void): void {
        if (this.spriteCache != null) {
            completed();
            return
        }
        this.spriteCache = this.spriteCache != null ? this.spriteCache : new SpriteCache();
        var ci = this.spriteCache.rings;
        var spriteLocations = new Array<string>();
        for (var j= 0; j < 4; j++) {
            spriteLocations.push(`assets/Sprites/ring${j}.png`);
            this.imageLength++;
        }
        var ind_ = this.spriteCache.indexes;
        this.spriteLoader = new SpriteLoader(completed, update);
        if (ci.count == 0) {
            var spriteStep = this.spriteLoader.addStep("Sprites",
                (i, done) => {
                    Help.loadSprite(spriteLocations[i],
                        jd => {
                            ci[i] = CanvasInformation.create(jd.width, jd.height, false);
                            ci[i].context.drawImage(jd, 0, 0);
                            done();
                        });
                },
                () => {
                    ind_.sprites++;
                    if (ind_.sprites == 4)
                        return true;
                    return false;
                },
                false);
            for (var i = 0; i < spriteLocations.length; i++) {
                this.spriteLoader.addIterationToStep(spriteStep, i);
            }
        }
        var cci = this.spriteCache.sonicSprites;
        if (cci.count == 0) {
            var sonicStep = this.spriteLoader.addStep("Sonic Sprites",
                (sp, done) => {
                    for (var sonicSprite in this.sonicSprites) {
                        let sonicImage = this.sonicSprites[sonicSprite];
                        cci[sonicSprite] = Help.scaleCsImage(sonicImage, new Point(1, 1), (ec) => {

                        });
                    }
                    done();
                },
                () => true,
                false);
            this.spriteLoader.addIterationToStep(sonicStep, 0);
        }
    }
    public mainDraw(canvas: CanvasInformation): void {
        var context = canvas.context;
        if (this.inHaltMode)
            if (this.drawHaltMode(context))
                return
        this.engine.clear(canvas);
        if (this.sonicLevel == null)
            return
        context.save();
        var localPoint = new Point(0, 0);
        this.drawTickCount++;
        if (this.spriteLoader.truthy() && !this.spriteLoader.tick() || this.loading) {
            this.  drawLoading(context);
            context.restore();
            return
        }
        this.   updatePositions(context);
        var w1: number = this.windowLocation.width / 128 + 2;
        var h1: number = this.windowLocation.height / 128 + 2;
        if (this.currentGameState == GameState.Editing) {
            w1 += 1;
            h1 += 1;
            w1 /= this.scale.x;
            h1 /= this.scale.y;
        }
        var offs = SonicManager.getOffs(w1, h1);
        this.tilePaletteAnimationManager.tickAnimatedPalettes();
        this.tileAnimationManager.tickAnimatedTiles();
        var fxP: number = <number>((this.windowLocation.x) / 128.0);
        var fyP: number = <number>((this.windowLocation.y) / 128.0);
        this.resetCanvases();
        var zero = new Point(0, 0);
        if (this.background.truthy()) {
            var wOffset: number = this.windowLocation.x;
            var bw: number = this.background.width;
            var movex: number = (wOffset / bw) * bw;
            localPoint.x = -this.windowLocation.x + movex;
            localPoint.y = -this.windowLocation.y / 4;
            this.background.draw(this.lowChunkCanvas.context, localPoint, wOffset);
            localPoint.x = -this.windowLocation.x + movex + this.background.width;
            localPoint.y = -this.windowLocation.y / 4;
            this.background.draw(this.lowChunkCanvas.context, localPoint, wOffset);
        }
        this. drawLowChunks(this.lowChunkCanvas.context, zero, offs, fyP, fxP);
        if (this.showHeightMap)
            this.  drawHighChunks(this.lowChunkCanvas.context, fxP, fyP, offs, zero);
        this.  drawObjects(this.sonicCanvas.context, zero);
       this. drawAnimations(this.sonicCanvas.context);
       this. drawRings(this.sonicCanvas.context, zero);
       this. drawSonic(this.sonicCanvas.context);
        if (!this.showHeightMap)
            this.  drawHighChunks(this.highChuckCanvas.context, fxP, fyP, offs, zero);
        this.  drawDebugTextChunks(this.highChuckCanvas.context, fxP, fyP, offs, zero);
//        this.lowChunkCanvas.context.offsetPixelsForWater();
//        this.highChuckCanvas.context.offsetPixelsForWater();
        this. drawCanveses(context, localPoint);
        context.restore();
        if (this.currentGameState == GameState.Playing)
            this.sonicToon.drawUI(context, new Point(this.screenOffset.x, this.screenOffset.y));
    }
    private drawCanveses(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        canvas.scale(this.scale.x, this.scale.y);
        canvas.drawImage(this.lowChunkCanvas.canvas, localPoint.x, localPoint.y);
        canvas.drawImage(this.sonicCanvas.canvas, localPoint.x, localPoint.y);
        canvas.drawImage(this.highChuckCanvas.canvas, localPoint.x, localPoint.y);
    }
    public resetCanvases(): void {
        this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation.create(this.windowLocation.width, this.windowLocation.height, false);
        this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation.create(this.windowLocation.width, this.windowLocation.height, true);
        this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation.create(this.windowLocation.width, this.windowLocation.height, false);
        this.sonicCanvas.context.clearRect(0, 0, this.windowLocation.width, this.windowLocation.height);
        this.highChuckCanvas.context.clearRect(0, 0, this.windowLocation.width, this.windowLocation.height);
        this.lowChunkCanvas.context.clearRect(0, 0, this.windowLocation.width, this.windowLocation.height);
    }
    public destroyCanvases(): void {
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
        this.screenOffset.x = 0;
        this.screenOffset.y = 0;
        if (this.currentGameState == GameState.Playing)
            this.updatePositionsForPlaying(canvas);
    }
    private updatePositionsForPlaying(canvas: CanvasRenderingContext2D): void {
        canvas.scale(this.realScale.x, this.realScale.y);
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
        canvas.fillText("Loading...   ", 95, 95);
        canvas.restore();
        return
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
            var _xP: number = fxP + off.x;
            var _yP: number = fyP + off.y;
            var _xPreal: number = fxP + off.x;
            var _yPreal: number = fyP + off.y;
            _xP = Help.mod(_xP, this.sonicLevel.levelWidth);
            _yP = Help.mod(_yP, this.sonicLevel.levelHeight);
            var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.x = (_xPreal * 128) - this.windowLocation.x;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y;
            if (!chunk.isEmpty() && !chunk.onlyForeground())
                chunk.draw(canvas, localPoint, ChunkLayer.Low);
        }
    }
    private drawHighChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs: Point[], localPoint: Point): void {
        for (var off of offs) {
            var _xP: number = fxP + off.x;
            var _yP: number = fyP + off.y;
            var _xPreal: number = fxP + off.x;
            var _yPreal: number = fyP + off.y;
            _xP = Help.mod(_xP, this.sonicLevel.levelWidth);
            _yP = Help.mod(_yP, this.sonicLevel.levelHeight);
            var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.x = (_xPreal * 128) - this.windowLocation.x;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y;
            if (!chunk.isEmpty() && !chunk.onlyBackground())
                chunk.draw(canvas, localPoint, ChunkLayer.High);
            if (this.showHeightMap) {
                var fd = this.spriteCache.heightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + chunk.index];
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
    private drawDebugTextChunks(canvas: CanvasRenderingContext2D, fxP: number, fyP: number, offs:Point[], localPoint: Point): void {
        for (var off of offs) {
            var _xP: number = fxP + off.x;
            var _yP: number = fyP + off.y;
            var _xPreal: number = fxP + off.x;
            var _yPreal: number = fyP + off.y;
            _xP = Help.mod(_xP, this.sonicLevel.levelWidth);
            _yP = Help.mod(_yP, this.sonicLevel.levelHeight);
            var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
            if (chunk == null)
                continue;
            localPoint.x = (_xPreal * 128) - this.windowLocation.x;
            localPoint.y = (_yPreal * 128) - this.windowLocation.y;
            if (!chunk.isEmpty() && !chunk.onlyForeground())
                chunk.drawAnimationDebug(canvas, localPoint, ChunkLayer.Low, this.tileChunkDebugDrawOptions);
            if (!chunk.isEmpty() && !chunk.onlyBackground())
                chunk.drawAnimationDebug(canvas, localPoint, ChunkLayer.High, this.tileChunkDebugDrawOptions);
        }
    }
    private cacheHeightMapForChunk(chunk): CanvasInformation {
        var md = chunk;
        var posj1 = new Point(0, 0);
        var canv = CanvasInformation.create(128, 128, false);
        var ctx = canv.context;
        this.engine.clear(canv);
        for (var _y = 0; _y < 8; _y++) {
            for (var _x = 0; _x < 8; _x++) {
                var tp = md.tilePieces[_x][_y];
                var solid = <number>(this.sonicLevel.curHeightMap ? tp.solid1 : tp.solid2);
                var hd = this.sonicLevel.curHeightMap ? tp.getLayer1HeightMaps() : tp.getLayer2HeightMaps();
                var __x = _x;
                var __y = _y;
                var vangle = 0;
                var posm = new Point(posj1.x + (__x * 16), posj1.y + (__y * 16));
                if (hd.falsey())
                    continue;
                if (hd.full == false) {

                }
                else if (hd.full == true) {
                    if (solid > 0) {
                        ctx.fillStyle = HeightMap.colors[solid];
                        ctx.fillRect(posj1.x + (__x * 16),
                            posj1.y + (__y * 16),
                            16,
                            16);
                    }
                }
                else {
                    vangle = this.sonicLevel.curHeightMap ? tp.getLayer1Angles() : tp.getLayer2Angles();
                    hd.draw(ctx, posm, tp.xFlip, tp.yFlip, solid, vangle);
                }
            }
        }
        return this.spriteCache.heightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + md.index] = canv;
    }
    private drawSonic(canvas: CanvasRenderingContext2D): void {
        if (this.currentGameState == GameState.Playing) {
            this.sonicToon.draw(canvas);
        }
    }
    private drawRings(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        for (var index: number = 0; index < this.sonicLevel.rings.count; index++) {
            var r = this.sonicLevel.rings[index];
            switch (this.currentGameState) {
                case GameState.Playing:
                    if (!this.sonicToon.obtainedRing[index]) {
                        if (this.bigWindowLocation.intersects(r))
                            this.goodRing.draw(canvas, r.negate(this.windowLocation.x, this.windowLocation.y));
                    }
                    break;
                case GameState.Editing:
                    if (this.bigWindowLocation.intersects(r))
                        this.goodRing.draw(canvas, r.negate(this.windowLocation.x, this.windowLocation.y));
                    break;
            }
        }
        switch (this.currentGameState) {
            case GameState.Playing:
                for (var i= this.activeRings.length- 1; i >= 0; i--) {
                    var ac = this.activeRings[i];
                    localPoint.x = ac.x - this.windowLocation.x;
                    localPoint.y = ac.y - this.windowLocation.y;
                    ac.draw(canvas, localPoint);
                    if (ac.tickCount > 256)
                        this.activeRings.splice(i, 1);
                }
                break;
            case GameState.Editing:
                break;
        }
    }
    private drawAnimations(canvas: CanvasRenderingContext2D): void {
        for (var ano of this.animationInstances) {
            ano.draw(canvas, -this.windowLocation.x, -this.windowLocation.y);
        }
    }
    private drawObjects(canvas: CanvasRenderingContext2D, localPoint: Point): void {
        var levelObjectInfos: LevelObjectInfo[] = this.sonicLevel.objects;
        for (var o of levelObjectInfos) {
            localPoint.x = o.x;
            localPoint.y = o.y;
            if (o.dead || this.bigWindowLocation.intersects(localPoint)) {
                o.draw(canvas,
                    ((localPoint.x - this.windowLocation.x)),
                    ((localPoint.y - this.windowLocation.y)),
                    this.showHeightMap);
            }
        }
    }
    private containsAnimatedTile(tile: number, sonLevel: SonicLevel): TileAnimationData {
        for (var an of sonLevel.tileAnimations) {
            var anin = an.animationTileIndex;
            var num = an.numberOfTiles;
            if (tile >= anin && tile < anin + num)
                return an;
        }
        return null;
    }
    public clearCache(): void {
        if (this.spriteCache != null)
            this.spriteCache.clearCache();
        if (this.sonicLevel != null)
            this.sonicLevel.clearCache();
        if (this.tilePaletteAnimationManager != null)
            this.tilePaletteAnimationManager.clearCache();
        if (this.tileAnimationManager != null)
            this.tileAnimationManager.clearCache();
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
        this.replace(new Rectangle(0, 0, 15, 30), new Point(712, 40));
    }
    public replace(from: Rectangle, to: Point): void {
        for (var y: number = from.height; y >= 0; y--) {
            var curY: number = y;
            window.setTimeout(() => {
                for (var x: number = 0; x < from.width; x++) {
                    var toChunkX = (to.x + x) / 8;
                    var toChunkY = (to.y + curY) / 8;
                    var tochunk = this.sonicLevel.getChunkAt(toChunkX, toChunkY);
                    tochunk.clearCache();
                    var totp = tochunk.tilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                    tochunk.isOnlyBackground = null;
                    tochunk.isOnlyForeground = null;
                    var fromChunkX = (from.x + x) / 8;
                    var fromChunkY = (from.y + curY) / 8;
                    var fromchunk = this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                    fromchunk.clearCache();
                    fromchunk.isOnlyBackground = null;
                    fromchunk.isOnlyForeground = null;
                    var fromtp = fromchunk.tilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8];
                    tochunk.tilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8] = fromtp;
                    fromchunk.tilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8] = totp;
                }
            },
                (from.height - y) * 50);
        }
    }
    public cacheTiles(): void {
        console.time("tileCache");
        this.tilePaletteAnimationManager = new TilePaletteAnimationManager(this);
        this.tileAnimationManager = new TileAnimationManager(this);
        for (var chunk of this.sonicLevel.tileChunks) {
            chunk.initCache();
            chunk.warmCache();
        }
        console.timeEnd("tileCache");
        if (this.sonicToon != null) {
            console.time("collisionCache");
            for (var chunk of this.sonicLevel.tileChunks) {
                this.sonicToon.sensorManager.buildChunk(chunk, false);
                this.sonicToon.sensorManager.buildChunk(chunk, true);
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
            var debugCanvases: CanvasInformation[] = [];
            var totalHeight: number = 0;
            var broke = false;
            for (var index: number = dropOffIndex; index < this.sonicLevel.tileChunks.count; index++) {
                var chunk = this.sonicLevel.tileChunks[index];
                var canvasCache = chunk.debug_DrawCache();
                totalHeight += canvasCache.canvas.height;
                debugCanvases.push(canvasCache);
                if (totalHeight > 10000) {
                    dropOffIndex = index + 1;
                    broke = true;
                    break;
                }
            }
            var bigOne = CanvasInformation.create(numWide * 128, totalHeight, false);
            var currentPosition: number = 0;
            for (var index: number = 0; index < debugCanvases.length; index++) {
                var canvasInformation = debugCanvases[index];
                bigOne.context.drawImage(canvasInformation.canvas, 0, currentPosition);
                currentPosition += canvasInformation.canvas.height;
            }
            pieces.push(bigOne.canvas.toDataURL());
            if (!broke)
                break;
        }
        var str = "<html><body>";
        for (var piece of pieces) {
            str += "<img src=\"" + piece + "\"/>\n";
        }
        str += "</body></html>";
        var tx = <textAreaElement>window.document.createElement("textarea");
        tx.style.position = "absolute";
        tx.value = str;
        window.document.body.appendChild(tx);
    }
}
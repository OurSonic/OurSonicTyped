import {Point, IntersectingRectangle, Rectangle} from "../common/Utils";
import {CanvasInformation} from "../common/CanvasInformation";
import {SonicEngine} from "./SonicEngine";
import {GameState} from "../common/Enums";
import {Help} from "../common/Help";
import {Sonic} from "./sonic/Sonic";
import {HeightMap} from "./level/HeightMap";
import {ObjectManager} from "./level/objects/ObjectManager";
import {SonicLevel, PaletteItem, PaletteItemPieces} from "./SonicLevel";
import {LevelObjectInfo} from "./level/objects/LevelObjectInfo";
import {Ring} from "./level/Ring";
import {TileAnimationData, TileAnimationDataFrame} from "./level/animations/TileAnimationData";
import {TilePaletteAnimationManager} from "./level/tiles/TilePaletteAnimationManager";
import {TileAnimationManager} from "./level/tiles/TileAnimationManager";
import {TileChunk} from "./level/tiles/TileChunk";
import {LevelObject} from "./level/objects/LevelObject";
import {LevelObjectData} from "./level/objects/LevelObjectData";
import {SLData as SlData, AnimatedPaletteItem} from "../SLData";
import {Tile} from "./level/tiles/Tile";
import {TilePiece} from "./level/tiles/TilePiece";
import {TileInfo} from "./level/tiles/TileInfo";
import {TilePieceInfo} from "./level/tiles/TilePieceInfo";

export class SonicManager {
    public static instance: SonicManager;
    public sonicLevel: SonicLevel;

    private static _cachedOffs: { [key: number]: Point[] } = {};
    private objectManager: ObjectManager;
    public drawTickCount: number;
    private touchDown: boolean;
    public tickCount: number;
    public currentGameState: GameState;
    public objectTickWindow: IntersectingRectangle;
    public windowLocation: IntersectingRectangle;
    public sonicToon: Sonic;
    private ringCache: Ring;
    public activeRings: Ring[];
    public showHeightMap: boolean;
    public inFocusObjects: LevelObjectInfo[];
    private tilePaletteAnimationManager: TilePaletteAnimationManager;
    public tileAnimationManager: TileAnimationManager;
    protected loading: boolean;


    constructor(private engine: SonicEngine, private resize: () => void) {
        SonicManager.instance = this;

        (<any>window).OurSonic = {SonicManager: {instance: SonicManager.instance}, SonicEngine: engine};

        this.objectManager = new ObjectManager(this);
        this.objectManager.Init();
        this.windowLocation = Help.defaultWindowLocation(GameState.Editing);
        this.objectTickWindow = Help.defaultWindowLocation(GameState.Editing);
        this.objectTickWindow.width = (this.objectTickWindow.width * 1.8) | 0;
        this.objectTickWindow.height = (this.objectTickWindow.height * 1.8) | 0;
        this.showHeightMap = false;
        this.ringCache = new Ring(false);
        this.activeRings = [];
        this.currentGameState = GameState.Editing;
        this.tickCount = 0;
        this.drawTickCount = 0;
    }

    public onClick(event: JQueryEventObject): boolean {
        this.touchDown = true;
        return this.effectClick(event);

    }

    private effectClick(event: JQueryEventObject): boolean {
        return true;
        /*
                if (!this.sonicLevel) return;
                let e = new Point((event.clientX + this.windowLocation.x),
                    (event.clientY + this.windowLocation.y));
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
        */
    }

    private tickObjects(): void {
        this.inFocusObjects = [];
        let levelObjectInfos = this.sonicLevel.objects;
        for (let obj of levelObjectInfos) {
            if (this.objectTickWindow.intersects(obj.x | 0, obj.y | 0)) {
                this.inFocusObjects.push(obj);
                obj.tick(obj, this.sonicLevel, this.sonicToon);
            }
        }
    }

    public tick(): void {
        if (this.loading)
            return;
        if (this.currentGameState === GameState.Playing) {

            this.tickCount++;
            this.tickObjects();
            this.sonicToon.tick(this.sonicLevel);
        }
    }


    public mainDraw(): void {
        if (this.sonicLevel === undefined)
            return;
        this.drawTickCount++;
        if (this.engine.spriteLoader && !this.engine.spriteLoader.tick() || this.loading) {
            SonicManager.drawLoading(this.engine.spriteCanvas.context);
            return;
        }
        this.updatePositions();
        this.tilePaletteAnimationManager.tickAnimatedPalettes();
        this.tileAnimationManager.tickAnimatedTiles();
        this.resetCanvases();
        this.drawBackChunksPixel(this.windowLocation.x, this.windowLocation.y);
        this.drawChunksPixel(this.windowLocation.x, this.windowLocation.y);

        this.drawObjects(this.engine.spriteCanvas.context);
        this.drawRings(this.engine.spriteCanvas.context);
        if (this.currentGameState == GameState.Playing) {
            this.sonicToon.draw(this.engine.spriteCanvas.context);
        }

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
                    let fd = this.engine.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + chunk.Index];
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
        this.windowLocation.x = (this.sonicToon.x) - this.windowLocation.width / 2;
        this.windowLocation.y = (this.sonicToon.y) - this.windowLocation.height / 2;
        this.objectTickWindow.width = (this.windowLocation.width * 1.8);
        this.objectTickWindow.height = (this.windowLocation.height * 1.8);
        this.objectTickWindow.x = (((this.sonicToon.x) - this.objectTickWindow.width / 2) - this.windowLocation.width * 0.2);
        this.objectTickWindow.y = (((this.sonicToon.y) - this.objectTickWindow.height / 2) - this.windowLocation.height * 0.2);
    }

    private static drawLoading(canvas: CanvasRenderingContext2D): void {
        canvas.fillStyle = "white";
        canvas.fillText("loading...   ", 0, 0);
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

        let endX = windowX + 320 + 16 * 2;
        let endY = windowY + 224 + 16 * 2;

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
                let drawOrderIndex = pieceInfo.xFlip ? (pieceInfo.yFlip ? 0 : 1) : (pieceInfo.yFlip ? 2 : 3);

                let tileX = ((repositionedX / 8) | 0) - chunkX * 16 - tilePieceX * 2;
                let tileY = ((repositionedY / 8) | 0) - chunkY * 16 - tilePieceY * 2;
                let drawOrder = TilePiece.DrawOrder[drawOrderIndex];
                let tileIndex = tileY * 2 + tileX;
                let tileNumber = drawOrder[tileIndex];
                let tileItem = piece.tiles[tileNumber];


                let tile = tileItem.getTile();
                if (tile === undefined)
                    continue;

                let palette_ = SonicManager.instance.sonicLevel.palette;
                let colorPaletteIndex: number = tileItem.palette;

                let pixelX = repositionedX - (chunkX * 128 + tilePieceX * 16 + tileX * 8);
                let pixelY = repositionedY - (chunkY * 128 + tilePieceY * 16 + tileY * 8);


                let colorIndex = tile.colors[pixelX][pixelY];
                if (colorIndex === 0)
                    continue;

                let iX, iY;
                if (pieceInfo.xFlip !== tileItem.xFlip) {
                    iX = (drawX - pixelX) + (7 - pixelX);
                } else {
                    iX = drawX;
                }
                if (pieceInfo.yFlip !== tileItem.yFlip) {
                    iY = (drawY - pixelY) + (7 - pixelY);
                } else {
                    iY = drawY;
                }
                let index = ((iY) * (320 + 16 * 2) + (iX));

                let value = palette_[colorPaletteIndex][colorIndex];

                if (tileItem.priority === false) {
                    lowBuffer[index] = value;
                } else {
                    highBuffer[index] = value;
                }
            }
        }
        this.engine.lowTileCanvas.context.putImageData(this.lowCacheImageData, -17, -17);
        this.engine.highTileCanvas.context.putImageData(this.highCacheImageData, -17, -17);
    }


    private drawBackChunksPixel(windowX: number, windowY: number): void {
        let levelWidthPixels = this.sonicLevel.bgLevelWidth * 128;
        let levelHeightPixels = this.sonicLevel.bgLevelHeight * 128;

        windowX = Help.mod(windowX - 16, levelWidthPixels);
        windowY = Help.mod(windowY - 16, levelHeightPixels);

        let lowBuffer = this.lowCacheBuffer;
        let highBuffer = this.highCacheBuffer;

        lowBuffer.fill(0)
        highBuffer.fill(0)

        let endX = windowX + 320 + 16 * 2;
        let endY = windowY + 224 + 16 * 2;

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

                let chunk = this.sonicLevel.getBackgroundChunkAt(chunkX, chunkY);
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
                let drawOrderIndex = pieceInfo.xFlip ? (pieceInfo.yFlip ? 0 : 1) : (pieceInfo.yFlip ? 2 : 3);

                let tileX = ((repositionedX / 8) | 0) - chunkX * 16 - tilePieceX * 2;
                let tileY = ((repositionedY / 8) | 0) - chunkY * 16 - tilePieceY * 2;
                let drawOrder = TilePiece.DrawOrder[drawOrderIndex];
                let tileIndex = tileY * 2 + tileX;
                let tileNumber = drawOrder[tileIndex];
                let tileItem = piece.tiles[tileNumber];


                let tile = tileItem.getTile();
                if (tile === undefined)
                    continue;

                let palette_ = SonicManager.instance.sonicLevel.palette;
                let colorPaletteIndex: number = tileItem.palette;

                let pixelX = repositionedX - (chunkX * 128 + tilePieceX * 16 + tileX * 8);
                let pixelY = repositionedY - (chunkY * 128 + tilePieceY * 16 + tileY * 8);


                let colorIndex = tile.colors[pixelX][pixelY];
                if (colorIndex === 0)
                    continue;

                let iX, iY;
                if (pieceInfo.xFlip !== tileItem.xFlip) {
                    iX = (drawX - pixelX) + (7 - pixelX);
                } else {
                    iX = drawX;
                }
                if (pieceInfo.yFlip !== tileItem.yFlip) {
                    iY = (drawY - pixelY) + (7 - pixelY);
                } else {
                    iY = drawY;
                }
                let index = ((iY) * (320 + 16 * 2) + (iX));

                let value = palette_[colorPaletteIndex][colorIndex];

                if (tileItem.priority === false) {
                    lowBuffer[index] = value;
                } else {
                    highBuffer[index] = value;
                }
            }
        }
        this.engine.bgLowTileCanvas.context.putImageData(this.lowCacheImageData, -17, -17);
        this.engine.bgHighTileCanvas.context.putImageData(this.highCacheImageData, -17, -17);
    }

    private cacheHeightMapForChunk(chunk: TileChunk): CanvasInformation {
        let md = chunk;
        let posj1 = new Point(0, 0);
        let canv = CanvasInformation.create(128, 128, false);
        let ctx = canv.context;
        for (let _y = 0; _y < 8; _y++) {
            for (let _x = 0; _x < 8; _x++) {
                let tp = md.TilePieces[_x][_y];
                let solid = <number>(this.sonicLevel.curHeightMap ? tp.solid1 : tp.solid2);
                let hd = this.sonicLevel.curHeightMap ? tp.getLayer1HeightMaps() : tp.getLayer2HeightMaps();
                let __x = _x;
                let __y = _y;
                let vangle = 0;
                if (!hd)
                    continue;
                vangle = this.sonicLevel.curHeightMap ? tp.getLayer1Angles() : tp.getLayer2Angles();
                hd.draw(ctx, posj1.x + (__x * 16), posj1.y + (__y * 16), tp.xFlip, tp.yFlip, solid, vangle);
            }
        }
        return this.engine.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + md.Index] = canv;
    }


    private drawRings(context: CanvasRenderingContext2D): void {
        for (let index: number = 0; index < this.sonicLevel.rings.length; index++) {
            let r = this.sonicLevel.rings[index];
            switch (this.currentGameState) {
                case GameState.Playing:
                    if (!this.sonicToon.obtainedRing[index]) {
                        if (this.objectTickWindow.intersects(r.x, r.y))
                            this.ringCache.Draw(context, (r.x - this.windowLocation.x) | 0, (r.y - this.windowLocation.y ) | 0);
                    }
                    break;
                case GameState.Editing:
                    if (this.objectTickWindow.intersects(r.x, r.y))
                        this.ringCache.Draw(context, (r.x - this.windowLocation.x) | 0, (r.y - this.windowLocation.y ) | 0);
                    break;
            }
        }
        switch (this.currentGameState) {
            case GameState.Playing:
                for (let i: number = this.activeRings.length - 1; i >= 0; i--) {
                    let ac: Ring = this.activeRings[i];
                    ac.Draw(context, ac.x - this.windowLocation.x | 0, ac.y - this.windowLocation.y | 0);
                    if (ac.TickCount > 256)
                        this.activeRings.splice(i, 1);
                }
                break;
            case GameState.Editing:
                break;
        }
    }


    private drawObjects(context: CanvasRenderingContext2D): void {
        let levelObjectInfos: LevelObjectInfo[] = this.sonicLevel.objects;
        for (let o of levelObjectInfos) {
            if (o.dead || this.objectTickWindow.intersects(o.x, o.y)) {
                o.draw(context, ((o.x - this.windowLocation.x)) | 0, ((o.y - this.windowLocation.y)) | 0, this.showHeightMap);
            }
        }
    }

    public clearCache(): void {

        if (this.tilePaletteAnimationManager != null)
            this.tilePaletteAnimationManager.ClearCache();
        if (this.tileAnimationManager != null)
            this.tileAnimationManager.clearCache();
    }

    public mouseUp(queryEvent: JQueryEventObject): boolean {
        this.touchDown = false;
        return false;
    }

    public mouseMove(queryEvent: JQueryEventObject): boolean {
        if (this.touchDown)
            if (this.effectClick(queryEvent))
                return true;
        return false;
    }

    public ReplaceMagic(): void {
        this.Replace(new Rectangle(0, 0, 15, 30), new Point(712, 40));
    }

    public Replace(from: Rectangle, to: Point): void {
        for (let y: number = from.height; y >= 0; y--) {
            let curY: number = y;
            window.setTimeout(() => {
                    for (let x: number = 0; x < from.width; x++) {
                        let toChunkX = (to.x + x) / 8;
                        let toChunkY = (to.y + curY) / 8;
                        let toChunk = this.sonicLevel.getChunkAt(toChunkX, toChunkY);
                        let toTilePiece = toChunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                        toChunk.checkOnlyForeground();
                        toChunk.checkOnlyBackground();
                        let fromChunkX = (from.x + x) / 8 | 0;
                        let fromChunkY = (from.y + curY) / 8 | 0;
                        let fromChunk = this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                        fromChunk.checkOnlyForeground();
                        fromChunk.checkOnlyBackground();
                        let fromTilePiece = fromChunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8];
                        toChunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8] = fromTilePiece;
                        fromChunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8] = toTilePiece;
                    }
                },
                (from.height - y) * 50);
        }
    }


    /*load*/
    public cachedObjects: { [key: string]: LevelObject };

    public loadObjects(objects: { key: string, value: string }[]): void {
        this.cachedObjects = {};
        for (let t of this.sonicLevel.objects) {
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
        fetch('https://api.oursonic.org/objects?object-keys=' + objects.join('~'))
            .then(async (resp) => {
                this.loadObjects(await resp.json());
            });
    }

    public load(slData: SlData): void {
        this.loading = true;
        this.sonicLevel = new SonicLevel();
        for (let n = 0; n < slData.Rings.length; n++) {
            this.sonicLevel.rings[n] = new Ring(true);
            this.sonicLevel.rings[n].x = slData.Rings[n].X;
            this.sonicLevel.rings[n].y = slData.Rings[n].Y;
        }
        this.sonicLevel.levelWidth = slData.ForegroundWidth;
        this.sonicLevel.levelHeight = slData.ForegroundHeight;
        this.sonicLevel.chunkMap = slData.Foreground;
        this.sonicLevel.bgChunkMap = slData.Background;
        this.sonicLevel.bgLevelWidth = slData.BackgroundWidth;
        this.sonicLevel.bgLevelHeight = slData.BackgroundHeight;

        for (let l = 0; l < slData.Objects.length; l++) {
            this.sonicLevel.objects[l] = new LevelObjectInfo(slData.Objects[l]);
            this.sonicLevel.objects[l].index = l;
        }
        let objectKeys: string[] = [];
        for (let obj of this.sonicLevel.objects) {
            let o = obj.key;
            if (objectKeys.filter(p => p != o).length == objectKeys.length)
                objectKeys.push(o);
        }
        this.downloadObjects(objectKeys);

        for (let tileIndex = 0; tileIndex < slData.Tiles.length; tileIndex++) {
            let tileColors = slData.Tiles[tileIndex];
            let colorCollection: number[] = [];
            for (let i = 0; i < tileColors.length; i++) {
                let value = tileColors[i];
                colorCollection.push(value >> 4);
                colorCollection.push(value & 0xF);
            }
            let colors = new Array(8);
            for (let o: number = 0; o < 8; o++) {
                colors[o] = new Array(8);
            }
            for (let n: number = 0; n < colorCollection.length; n++) {
                colors[n % 8][n / 8 | 0] = colorCollection[n];
            }
            this.sonicLevel.tiles[tileIndex] = new Tile(colors);
            this.sonicLevel.tiles[tileIndex].index = tileIndex;
        }
        if (slData.AnimatedFiles) {
            this.sonicLevel.animatedTileFiles = new Array(slData.AnimatedFiles.length);
            for (let animatedFileIndex = 0; animatedFileIndex < slData.AnimatedFiles.length; animatedFileIndex++) {
                let animatedFile = slData.AnimatedFiles[animatedFileIndex];
                this.sonicLevel.animatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
                for (let animationIndex = 0; animationIndex < animatedFile.length; animationIndex++) {
                    let tileColors = animatedFile[animationIndex];
                    let colorCollection: number[] = [];
                    for (let l = 0; l < tileColors.length; l++) {
                        let value = animatedFile[animationIndex][l];
                        colorCollection.push(value >> 4);
                        colorCollection.push(value & 0xF);
                    }
                    let colors = new Array(8);
                    for (let col = 0; col < 8; col++) {
                        colors[col] = new Array(8);
                    }
                    for (let col = 0; col < colorCollection.length; col++) {
                        colors[col % 8][col / 8 | 0] = colorCollection[col];
                    }
                    let tile = new Tile(colors);
                    tile.index = animationIndex * 10000 + animatedFileIndex;
                    this.sonicLevel.animatedTileFiles[animatedFileIndex][animationIndex] = tile;
                }
            }
        }

        for (let blockIndex = 0; blockIndex < slData.Blocks.length; blockIndex++) {
            let tiles = slData.Blocks[blockIndex];
            let tilePiece = new TilePiece();
            tilePiece.index = blockIndex;
            tilePiece.tiles = [];
            for (let tileIndex: number = 0; tileIndex < tiles.length; tileIndex++) {
                let tileInfo = new TileInfo();
                tileInfo.tileIndex = tiles[tileIndex].Tile;
                tileInfo.palette = tiles[tileIndex].Palette;
                tileInfo.priority = tiles[tileIndex].Priority;
                tileInfo.xFlip = tiles[tileIndex].XFlip;
                tileInfo.yFlip = tiles[tileIndex].YFlip;
                tilePiece.tiles.push(tileInfo);
            }
            tilePiece.Init();
            this.sonicLevel.tilePieces[blockIndex] = tilePiece;
        }
        this.sonicLevel.angles = slData.Angles;
        this.sonicLevel.tileAnimations = slData.Animations.map(tileData => {
            let tileAnimation = new TileAnimationData();
            tileAnimation.animationTileFile = tileData.AnimationFile;
            tileAnimation.animationTileIndex = tileData.AnimationTileIndex;
            tileAnimation.automatedTiming = tileData.AutomatedTiming;
            tileAnimation.numberOfTiles = tileData.NumberOfTiles;
            tileAnimation.dataFrames = tileData.Frames.map(frameData => {
                let frame = new TileAnimationDataFrame();
                frame.ticks = frameData.Ticks==-1?1:frameData.Ticks;
                frame.startingTileIndex = frameData.StartingTileIndex;
                return frame;
            });
            return tileAnimation;
        });

        this.sonicLevel.collisionIndexes1 = slData.CollisionIndexes1;
        this.sonicLevel.collisionIndexes2 = slData.CollisionIndexes2;

        this.sonicLevel.heightMaps = slData.HeightMaps.map((h, index) => new HeightMap(h, index));

        for (let j: number = 0; j < slData.Chunks.length; j++) {
            let fc = slData.Chunks[j];
            let mj = new TileChunk();
            mj.Index = j;
            mj.TilePieces = new Array(8);
            for (let i: number = 0; i < 8; i++) {
                mj.TilePieces[i] = new Array(8);
            }
            for (let p: number = 0; p < fc.length; p++) {
                let tilePieceInfo = new TilePieceInfo();
                tilePieceInfo.index = p;
                tilePieceInfo.block = fc[p].Block;
                tilePieceInfo.solid1 = fc[p].Solid1;
                tilePieceInfo.solid2 = fc[p].Solid2;
                tilePieceInfo.xFlip = fc[p].XFlip;
                tilePieceInfo.yFlip = fc[p].YFlip;

                mj.TilePieces[p % 8][(p / 8) | 0] = tilePieceInfo;
            }
            this.sonicLevel.tileChunks[j] = mj;

        }
        this.sonicLevel.palette = slData.Palette.map(a => a.map(col => {
            let r = parseInt(col.slice(0, 2), 16);
            let g = parseInt(col.slice(2, 4), 16);
            let b = parseInt(col.slice(4, 6), 16);

            return (255 << 24) | (b << 16) | (g << 8) | r;
        }));

        this.sonicLevel.startPositions = slData.StartPositions.map(a => new Point(a.X, a.Y));
        this.sonicLevel.animatedPalettes = [];

        if (slData.PaletteItems.length > 0) {
            for (let k: number = 0; k < slData.PaletteItems[0].length; k++) {
                let pal: AnimatedPaletteItem = slData.PaletteItems[0][k];

                let animatedPalette = new PaletteItem();
                animatedPalette.palette = (<string[]>eval(pal.Palette)).map(col => {
                    let r = parseInt(col.slice(0, 2), 16);
                    let g = parseInt(col.slice(2, 4), 16);
                    let b = parseInt(col.slice(4, 6), 16);
                    return (255 << 24) | (b << 16) | (g << 8) | r;
                });
                animatedPalette.skipIndex = pal.SkipIndex;
                animatedPalette.totalLength = pal.TotalLength;
                animatedPalette.pieces = pal.Pieces.map(a => {
                    let piece = new PaletteItemPieces();
                    piece.paletteIndex = a.PaletteIndex;
                    piece.paletteMultiply = a.PaletteMultiply;
                    piece.paletteOffset = a.PaletteOffset;
                    return piece;
                });
                this.sonicLevel.animatedPalettes.push(animatedPalette);
            }
        }
        for (let tilePiece of this.sonicLevel.tilePieces) {
            for (let tileInfo of tilePiece.tiles) {
                let tile = tileInfo.getTile();
                if (!tile) continue;

                tile.animatedTileIndex = null;
                for (let tileAnimationIndex = 0; tileAnimationIndex < this.sonicLevel.tileAnimations.length; tileAnimationIndex++) {
                    let tileAnimationData = this.sonicLevel.tileAnimations[tileAnimationIndex];
                    let anin = tileAnimationData.animationTileIndex;
                    let num = tileAnimationData.numberOfTiles;
                    if (tile.index >= anin && tile.index < anin + num) {
                        tile.animatedTileIndex = tileAnimationIndex;
                    }
                }
            }
        }


        for (let chunk of this.sonicLevel.tileChunks) {
            chunk.checkEmpty();
            chunk.checkOnlyBackground();
            chunk.checkOnlyForeground();
        }
        this.tilePaletteAnimationManager = new TilePaletteAnimationManager(this);
        this.tileAnimationManager = new TileAnimationManager(this);

        this.engine.preloadSprites(() => {
            this.loading = false;
            this.resize();
        }, (s) => {
        });
        this.resize();
    }
}

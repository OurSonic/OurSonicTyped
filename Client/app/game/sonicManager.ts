import {CanvasInformation} from '../common/canvasInformation';
import {GameState} from '../common/enums';
import {Help} from '../common/help';
import {IntersectingRectangle, Point, Rectangle} from '../common/utils';
import {AnimatedPaletteItem, SlData} from '../slData';
import {TileAnimationData, TileAnimationDataFrame} from './level/animations/tileAnimationData';
import {HeightMap} from './level/heightMap';
import {LevelObject} from './level/objects/levelObject';
import {LevelObjectData} from './level/objects/levelObjectData';
import {LevelObjectInfo} from './level/objects/levelObjectInfo';
import {ObjectManager} from './level/objects/objectManager';
import {Ring} from './level/ring';
import {Tile} from './level/tiles/tile';
import {TileAnimationManager} from './level/tiles/tileAnimationManager';
import {TileChunk} from './level/tiles/tileChunk';
import {TileInfo} from './level/tiles/tileInfo';
import {TilePaletteAnimationManager} from './level/tiles/tilePaletteAnimationManager';
import {TilePiece} from './level/tiles/tilePiece';
import {TilePieceInfo} from './level/tiles/tilePieceInfo';
import {Sonic} from './sonic/sonic';
import {SonicEngine} from './sonicEngine';
import {PaletteItem, PaletteItemPieces, SonicLevel} from './sonicLevel';

export class SonicManager {
  static instance: SonicManager;
  sonicLevel: SonicLevel;

  private static _cachedOffs: {[key: number]: Point[]} = {};
  private objectManager: ObjectManager;
  drawTickCount: number;
  private touchDown: boolean;
  tickCount: number;
  currentGameState: GameState;
  objectTickWindow: IntersectingRectangle;
  windowLocation: IntersectingRectangle;
  sonicToon: Sonic;
  private ringCache: Ring;
  activeRings: Ring[];
  showHeightMap: boolean;
  inFocusObjects: LevelObjectInfo[];
  tilePaletteAnimationManager: TilePaletteAnimationManager;
  tileAnimationManager: TileAnimationManager;
  protected loading: boolean;

  constructor(private engine: SonicEngine, private resize: () => void) {
    SonicManager.instance = this;

    (window as any).OurSonic = {SonicManager: {instance: SonicManager.instance}, SonicEngine: engine};

    this.objectManager = new ObjectManager(this);
    this.objectManager.Init();
    this.windowLocation = SonicEngine.defaultWindowLocation(GameState.Editing);
    this.objectTickWindow = SonicEngine.defaultWindowLocation(GameState.Editing);
    this.objectTickWindow.width = (this.objectTickWindow.width * 1.8) | 0;
    this.objectTickWindow.height = (this.objectTickWindow.height * 1.8) | 0;
    this.showHeightMap = false;
    this.ringCache = new Ring(false);
    this.activeRings = [];
    this.currentGameState = GameState.Editing;
    this.tickCount = 0;
    this.drawTickCount = 0;
  }

  onClick(event: JQueryEventObject): boolean {
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
    const levelObjectInfos = this.sonicLevel.objects;
    for (const obj of levelObjectInfos) {
      if (this.objectTickWindow.intersects(obj.x | 0, obj.y | 0)) {
        this.inFocusObjects.push(obj);
        obj.tick(obj, this.sonicLevel, this.sonicToon);
      }
    }
  }

  tick(): void {
    if (this.loading) {
      return;
    }
    if (this.currentGameState === GameState.Playing) {
      this.tickCount++;
      this.tickObjects();
      this.sonicToon.tick(this.sonicLevel);
    }
  }

  mainDraw(): void {
    if (this.sonicLevel === undefined) {
      return;
    }
    this.drawTickCount++;
    if ((this.engine.spriteLoader && !this.engine.spriteLoader.tick()) || this.loading) {
      SonicManager.drawLoading(this.engine.spriteCanvas.context);
      return;
    }
    this.updatePositions();
    this.tilePaletteAnimationManager.tickAnimatedPalettes();
    this.tileAnimationManager.tickAnimatedTiles();
    this.resetCanvases();
    // this.drawBackChunksPixel(this.windowLocation.x, this.windowLocation.y);
    this.drawChunksPixel(this.windowLocation.x, this.windowLocation.y);

    this.drawObjects(this.engine.spriteCanvas.context);
    this.drawRings(this.engine.spriteCanvas.context);
    if (this.currentGameState === GameState.Playing) {
      this.sonicToon.draw(this.engine.spriteCanvas.context);
    }

    if (this.showHeightMap || this.currentGameState === GameState.Editing) {
      const w1: number = ((this.windowLocation.width / 128) | 0) + 2;
      const h1: number = ((this.windowLocation.height / 128) | 0) + 2;
      const offs = SonicManager.getOffs(w1, h1);

      const fxP: number = (this.windowLocation.x / 128) | 0;
      const fyP: number = (this.windowLocation.y / 128) | 0;
      for (const off of offs) {
        let _xP: number = fxP + off.x;
        let _yP: number = fyP + off.y;
        const _xPreal: number = fxP + off.x;
        const _yPreal: number = fyP + off.y;
        _xP = Help.mod(_xP, this.sonicLevel.levelWidth);
        _yP = Help.mod(_yP, this.sonicLevel.levelHeight);
        const chunk = this.sonicLevel.getChunkAt(_xP, _yP);
        if (chunk === null) {
          continue;
        }
        const x = (_xPreal * 128 - this.windowLocation.x) | 0;
        const y = (_yPreal * 128 - this.windowLocation.y) | 0;
        if (this.showHeightMap) {
          let fd = this.engine.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + ' ' + chunk.index];
          if (fd === null) {
            fd = this.cacheHeightMapForChunk(chunk);
          }
          this.engine.highTileCanvas.context.drawImage(fd.canvas, x, y);
        }
        if (this.currentGameState === GameState.Editing) {
          this.engine.highTileCanvas.context.strokeStyle = '#DD0033';
          this.engine.highTileCanvas.context.lineWidth = 1;
          this.engine.highTileCanvas.context.strokeRect(x, y, 128, 128);
        }
      }
    }
  }

  resetCanvases(): void {
    this.engine.spriteCanvas.context.clearRect(0, 0, 320, 224);
  }

  private static getOffs(w1: number, h1: number): Point[] {
    const hash: number = (w1 + 1) * (h1 + 1);
    if (SonicManager._cachedOffs[hash]) {
      return SonicManager._cachedOffs[hash];
    }
    const offs = new Array(0);
    let ca = 0;
    for (let y: number = -1; y < h1; y++) {
      for (let x: number = -1; x < w1; x++) {
        offs[ca++] = new Point(x, y);
      }
    }
    return (SonicManager._cachedOffs[hash] = offs);
  }

  private updatePositions(): void {
    if (this.currentGameState === GameState.Playing) {
      this.updatePositionsForPlaying();
    }
  }

  private updatePositionsForPlaying(): void {
    this.windowLocation.x = this.sonicToon.x - this.windowLocation.width / 2;
    this.windowLocation.y = this.sonicToon.y - this.windowLocation.height / 2;
    this.objectTickWindow.width = this.windowLocation.width * 1.8;
    this.objectTickWindow.height = this.windowLocation.height * 1.8;
    this.objectTickWindow.x = this.sonicToon.x - this.objectTickWindow.width / 2 - this.windowLocation.width * 0.2;
    this.objectTickWindow.y = this.sonicToon.y - this.objectTickWindow.height / 2 - this.windowLocation.height * 0.2;
  }

  private static drawLoading(canvas: CanvasRenderingContext2D): void {
    canvas.fillStyle = 'white';
    canvas.fillText('loading...   ', 0, 0);
  }

  width: number = 320;
  height: number = 224;

  lowCacheImageData = new ImageData(320 + 16 * 2, 224 + 16 * 2);
  lowCacheBuffer = new Uint32Array(this.lowCacheImageData.data.buffer);
  highCacheImageData = new ImageData(320 + 16 * 2, 224 + 16 * 2);
  highCacheBuffer = new Uint32Array(this.highCacheImageData.data.buffer);

  private drawChunksPixel(windowX: number, windowY: number): void {
    const levelWidthPixels = this.sonicLevel.levelWidth * 128;
    const levelHeightPixels = this.sonicLevel.levelHeight * 128;

    windowX = Help.mod(windowX - 16, levelWidthPixels);
    windowY = Help.mod(windowY - 16, levelHeightPixels);

    const lowBuffer = this.lowCacheBuffer;
    const highBuffer = this.highCacheBuffer;

    lowBuffer.fill(0);
    highBuffer.fill(0);

    const endX = windowX + 320 + 16 * 2;
    const endY = windowY + 224 + 16 * 2;

    let drawX = 0;
    let drawY = 0;
    for (let x = windowX; x < endX; x++) {
      const repositionedX = Help.mod(x, levelWidthPixels);
      drawX += 1;
      drawY = 0;
      for (let y = windowY; y < endY; y++) {
        const repositionedY = Help.mod(y, levelHeightPixels);
        drawY += 1;

        const chunkX = (repositionedX / 128) | 0;
        const chunkY = (repositionedY / 128) | 0;

        const chunk = this.sonicLevel.getChunkAt(chunkX, chunkY);
        if (chunk === undefined) {
          continue;
        }
        if (chunk.isEmpty === true) {
          continue;
        }

        const tilePieceX = ((repositionedX / 16) | 0) - chunkX * 8;
        const tilePieceY = ((repositionedY / 16) | 0) - chunkY * 8;

        const tpX = chunk.tilePieces[tilePieceX];
        if (tpX === undefined) {
          continue;
        }
        const pieceInfo = tpX[tilePieceY];
        if (pieceInfo === undefined) {
          continue;
        }
        const piece = pieceInfo.getTilePiece();
        if (piece === undefined) {
          continue;
        }
        const drawOrderIndex = pieceInfo.xFlip ? (pieceInfo.yFlip ? 0 : 1) : pieceInfo.yFlip ? 2 : 3;

        const tileX = ((repositionedX / 8) | 0) - chunkX * 16 - tilePieceX * 2;
        const tileY = ((repositionedY / 8) | 0) - chunkY * 16 - tilePieceY * 2;
        const drawOrder = TilePiece.drawOrder[drawOrderIndex];
        const tileIndex = tileY * 2 + tileX;
        const tileNumber = drawOrder[tileIndex];
        const tileItem = piece.tiles[tileNumber];

        const tile = tileItem.getTile();
        if (tile === undefined) {
          continue;
        }

        const palette_ = SonicManager.instance.sonicLevel.palette;
        const colorPaletteIndex: number = tileItem.palette;

        const pixelX = repositionedX - (chunkX * 128 + tilePieceX * 16 + tileX * 8);
        const pixelY = repositionedY - (chunkY * 128 + tilePieceY * 16 + tileY * 8);

        const colorIndex = tile.colors[pixelX][pixelY];
        if (colorIndex === 0) {
          continue;
        }

        let iX: number;
        let iY: number;
        if (pieceInfo.xFlip !== tileItem.xFlip) {
          iX = drawX - pixelX + (7 - pixelX);
        } else {
          iX = drawX;
        }
        if (pieceInfo.yFlip !== tileItem.yFlip) {
          iY = drawY - pixelY + (7 - pixelY);
        } else {
          iY = drawY;
        }
        const index = (iY * (320 + 16 * 2) + iX) | 0;

        const value = palette_[colorPaletteIndex][colorIndex] | 0;

        if (tileItem.priority === false) {
          lowBuffer[index] = value;
        } else {
          highBuffer[index] = value;
        }
      }
    }
    // this.engine.lowTileCanvas.context.putImageData(this.lowCacheImageData, -17, -17);
    this.engine.highTileCanvas.context.putImageData(this.highCacheImageData, -17, -17);
  }

  private drawBackChunksPixel(windowX: number, windowY: number): void {
    const levelWidthPixels = this.sonicLevel.bgLevelWidth * 128;
    const levelHeightPixels = this.sonicLevel.bgLevelHeight * 128;

    windowX = Help.mod(windowX - 16, levelWidthPixels);
    windowY = Help.mod(windowY - 16, levelHeightPixels);

    const lowBuffer = this.lowCacheBuffer;
    const highBuffer = this.highCacheBuffer;

    lowBuffer.fill(0);
    highBuffer.fill(0);

    const endX = windowX + 320 + 16 * 2;
    const endY = windowY + 224 + 16 * 2;

    let drawX = 0;
    let drawY = 0;
    for (let x = windowX; x < endX; x++) {
      const repositionedX = Help.mod(x, levelWidthPixels);
      drawX += 1;
      drawY = 0;
      for (let y = windowY; y < endY; y++) {
        const repositionedY = Help.mod(y, levelHeightPixels);
        drawY += 1;

        const chunkX = (repositionedX / 128) | 0;
        const chunkY = (repositionedY / 128) | 0;

        const chunk = this.sonicLevel.getBackgroundChunkAt(chunkX, chunkY);
        if (chunk === undefined) {
          continue;
        }
        if (chunk.isEmpty === true) {
          continue;
        }

        const tilePieceX = ((repositionedX / 16) | 0) - chunkX * 8;
        const tilePieceY = ((repositionedY / 16) | 0) - chunkY * 8;

        const tpX = chunk.tilePieces[tilePieceX];
        if (tpX === undefined) {
          continue;
        }
        const pieceInfo = tpX[tilePieceY];
        if (pieceInfo === undefined) {
          continue;
        }
        const piece = pieceInfo.getTilePiece();
        if (piece === undefined) {
          continue;
        }
        const drawOrderIndex = pieceInfo.xFlip ? (pieceInfo.yFlip ? 0 : 1) : pieceInfo.yFlip ? 2 : 3;

        const tileX = ((repositionedX / 8) | 0) - chunkX * 16 - tilePieceX * 2;
        const tileY = ((repositionedY / 8) | 0) - chunkY * 16 - tilePieceY * 2;
        const drawOrder = TilePiece.drawOrder[drawOrderIndex];
        const tileIndex = tileY * 2 + tileX;
        const tileNumber = drawOrder[tileIndex];
        const tileItem = piece.tiles[tileNumber];

        const tile = tileItem.getTile();
        if (tile === undefined) {
          continue;
        }

        const palette_ = SonicManager.instance.sonicLevel.palette;
        const colorPaletteIndex: number = tileItem.palette;

        const pixelX = repositionedX - (chunkX * 128 + tilePieceX * 16 + tileX * 8);
        const pixelY = repositionedY - (chunkY * 128 + tilePieceY * 16 + tileY * 8);

        const colorIndex = tile.colors[pixelX][pixelY];
        if (colorIndex === 0) {
          continue;
        }

        let iX;
        let iY;
        if (pieceInfo.xFlip !== tileItem.xFlip) {
          iX = drawX - pixelX + (7 - pixelX);
        } else {
          iX = drawX;
        }
        if (pieceInfo.yFlip !== tileItem.yFlip) {
          iY = drawY - pixelY + (7 - pixelY);
        } else {
          iY = drawY;
        }
        const index = iY * (320 + 16 * 2) + iX;

        const value = palette_[colorPaletteIndex][colorIndex];

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
    const md = chunk;
    const posj1 = new Point(0, 0);
    const canv = CanvasInformation.create(128, 128, false);
    const ctx = canv.context;
    for (let _y = 0; _y < 8; _y++) {
      for (let _x = 0; _x < 8; _x++) {
        const tp = md.tilePieces[_x][_y];
        const solid = (this.sonicLevel.curHeightMap ? tp.solid1 : tp.solid2) as number;
        const hd = this.sonicLevel.curHeightMap ? tp.getLayer1HeightMaps() : tp.getLayer2HeightMaps();
        const __x = _x;
        const __y = _y;
        let vangle = 0;
        if (!hd) {
          continue;
        }
        vangle = this.sonicLevel.curHeightMap ? tp.getLayer1Angles() : tp.getLayer2Angles();
        hd.draw(ctx, posj1.x + __x * 16, posj1.y + __y * 16, tp.xFlip, tp.yFlip, solid, vangle);
      }
    }
    return (this.engine.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + ' ' + md.index] = canv);
  }

  private drawRings(context: CanvasRenderingContext2D): void {
    for (let index: number = 0; index < this.sonicLevel.rings.length; index++) {
      const r = this.sonicLevel.rings[index];
      switch (this.currentGameState) {
        case GameState.Playing:
          if (!this.sonicToon.obtainedRing[index]) {
            if (this.objectTickWindow.intersects(r.x, r.y)) {
              this.ringCache.Draw(context, (r.x - this.windowLocation.x) | 0, (r.y - this.windowLocation.y) | 0);
            }
          }
          break;
        case GameState.Editing:
          if (this.objectTickWindow.intersects(r.x, r.y)) {
            this.ringCache.Draw(context, (r.x - this.windowLocation.x) | 0, (r.y - this.windowLocation.y) | 0);
          }
          break;
      }
    }
    switch (this.currentGameState) {
      case GameState.Playing:
        for (let i: number = this.activeRings.length - 1; i >= 0; i--) {
          const ac: Ring = this.activeRings[i];
          ac.Draw(context, (ac.x - this.windowLocation.x) | 0, (ac.y - this.windowLocation.y) | 0);
          if (ac.TickCount > 256) {
            this.activeRings.splice(i, 1);
          }
        }
        break;
      case GameState.Editing:
        break;
    }
  }

  private drawObjects(context: CanvasRenderingContext2D): void {
    const levelObjectInfos: LevelObjectInfo[] = this.sonicLevel.objects;
    for (const o of levelObjectInfos) {
      if (o.dead || this.objectTickWindow.intersects(o.x, o.y)) {
        o.draw(context, (o.x - this.windowLocation.x) | 0, (o.y - this.windowLocation.y) | 0, this.showHeightMap);
      }
    }
  }

  clearCache(): void {
    if (this.tilePaletteAnimationManager != null) {
      this.tilePaletteAnimationManager.clearCache();
    }
    if (this.tileAnimationManager != null) {
      this.tileAnimationManager.clearCache();
    }
  }

  mouseUp(queryEvent: JQueryEventObject): boolean {
    this.touchDown = false;
    return false;
  }

  mouseMove(queryEvent: JQueryEventObject): boolean {
    if (this.touchDown) {
      if (this.effectClick(queryEvent)) {
        return true;
      }
    }
    return false;
  }

  ReplaceMagic(): void {
    this.Replace(new Rectangle(0, 0, 15, 30), new Point(712, 40));
  }

  Replace(from: Rectangle, to: Point): void {
    for (let y: number = from.height; y >= 0; y--) {
      const curY: number = y;
      window.setTimeout(() => {
        for (let x: number = 0; x < from.width; x++) {
          const toChunkX = (to.x + x) / 8;
          const toChunkY = (to.y + curY) / 8;
          const toChunk = this.sonicLevel.getChunkAt(toChunkX, toChunkY);
          const toTilePiece = toChunk.tilePieces[to.x + x - toChunkX * 8][to.y + curY - toChunkY * 8];
          toChunk.checkOnlyForeground();
          toChunk.checkOnlyBackground();
          const fromChunkX = ((from.x + x) / 8) | 0;
          const fromChunkY = ((from.y + curY) / 8) | 0;
          const fromChunk = this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
          fromChunk.checkOnlyForeground();
          fromChunk.checkOnlyBackground();
          const fromTilePiece = fromChunk.tilePieces[from.x + x - fromChunkX * 8][from.y + curY - fromChunkY * 8];
          toChunk.tilePieces[to.x + x - toChunkX * 8][to.y + curY - toChunkY * 8] = fromTilePiece;
          fromChunk.tilePieces[from.x + x - fromChunkX * 8][from.y + curY - fromChunkY * 8] = toTilePiece;
        }
      }, (from.height - y) * 50);
    }
  }

  /*load*/
  cachedObjects: {[key: string]: LevelObject};

  loadObjects(objects: {key: string; value: string}[]): void {
    this.cachedObjects = {};
    for (const t of this.sonicLevel.objects) {
      const o = t.key;

      if (this.cachedObjects[o]) {
        t.setObjectData(this.cachedObjects[o]);
        continue;
      }
      const d = objects.filter(p => p.key === o)[0];
      if (!d) {
        t.setObjectData(new LevelObject(o));
        continue;
      }
      let dat: LevelObjectData;
      if (d.value.length === 0) {
        dat = new LevelObjectData();
      } else {
        dat = JSON.parse(d.value) as LevelObjectData;
      }
      const dr = ObjectManager.ExtendObject(dat);
      this.cachedObjects[o] = dr;
      t.setObjectData(dr);
    }
  }

  downloadObjects(objects: string[]): void {
    fetch('https://api.oursonic.org/objects?object-keys=' + objects.join('~')).then(async resp => {
      this.loadObjects(await resp.json());
    });
  }

  load(slData: SlData): void {
    this.loading = true;
    this.sonicLevel = new SonicLevel();
    for (let n = 0; n < slData.rings.length; n++) {
      this.sonicLevel.rings[n] = new Ring(true);
      this.sonicLevel.rings[n].x = slData.rings[n].x;
      this.sonicLevel.rings[n].y = slData.rings[n].y;
    }
    this.sonicLevel.levelWidth = slData.foregroundWidth;
    this.sonicLevel.levelHeight = slData.foregroundHeight;
    this.sonicLevel.chunkMap = slData.foreground;
    this.sonicLevel.bgChunkMap = slData.background;
    this.sonicLevel.bgLevelWidth = slData.backgroundWidth;
    this.sonicLevel.bgLevelHeight = slData.backgroundHeight;

    for (let l = 0; l < slData.objects.length; l++) {
      this.sonicLevel.objects[l] = new LevelObjectInfo(slData.objects[l]);
      this.sonicLevel.objects[l].index = l;
    }
    const objectKeys: string[] = [];
    for (const obj of this.sonicLevel.objects) {
      const o = obj.key;
      if (objectKeys.filter(p => p !== o).length === objectKeys.length) {
        objectKeys.push(o);
      }
    }
    this.downloadObjects(objectKeys);

    for (let tileIndex = 0; tileIndex < slData.tiles.length; tileIndex++) {
      const tileColors = slData.tiles[tileIndex];
      const colorCollection: number[] = [];
      for (let i = 0; i < tileColors.length; i++) {
        const value = tileColors[i];
        colorCollection.push(value >> 4);
        colorCollection.push(value & 0xf);
      }
      const colors = new Array(8);
      for (let o: number = 0; o < 8; o++) {
        colors[o] = new Array(8);
      }
      for (let n: number = 0; n < colorCollection.length; n++) {
        colors[n % 8][(n / 8) | 0] = colorCollection[n];
      }
      this.sonicLevel.tiles[tileIndex] = new Tile(colors);
      this.sonicLevel.tiles[tileIndex].index = tileIndex;
    }
    if (slData.animatedFiles) {
      this.sonicLevel.animatedTileFiles = new Array(slData.animatedFiles.length);
      for (let animatedFileIndex = 0; animatedFileIndex < slData.animatedFiles.length; animatedFileIndex++) {
        const animatedFile = slData.animatedFiles[animatedFileIndex];
        this.sonicLevel.animatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
        for (let animationIndex = 0; animationIndex < animatedFile.length; animationIndex++) {
          const tileColors = animatedFile[animationIndex];
          const colorCollection: number[] = [];
          for (let l = 0; l < tileColors.length; l++) {
            const value = animatedFile[animationIndex][l];
            colorCollection.push(value >> 4);
            colorCollection.push(value & 0xf);
          }
          const colors = new Array(8);
          for (let col = 0; col < 8; col++) {
            colors[col] = new Array(8);
          }
          for (let col = 0; col < colorCollection.length; col++) {
            colors[col % 8][(col / 8) | 0] = colorCollection[col];
          }
          const tile = new Tile(colors);
          tile.index = animationIndex * 10000 + animatedFileIndex;
          this.sonicLevel.animatedTileFiles[animatedFileIndex][animationIndex] = tile;
        }
      }
    }

    for (let blockIndex = 0; blockIndex < slData.blocks.length; blockIndex++) {
      const tiles = slData.blocks[blockIndex];
      const tilePiece = new TilePiece();
      tilePiece.index = blockIndex;
      tilePiece.tiles = [];
      for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
        const tileInfo = new TileInfo();
        tileInfo.tileIndex = tiles[tileIndex].tile;
        tileInfo.palette = tiles[tileIndex].palette;
        tileInfo.priority = tiles[tileIndex].priority;
        tileInfo.xFlip = tiles[tileIndex].xFlip;
        tileInfo.yFlip = tiles[tileIndex].yFlip;
        tilePiece.tiles.push(tileInfo);
      }
      tilePiece.init();
      this.sonicLevel.tilePieces[blockIndex] = tilePiece;
    }
    this.sonicLevel.angles = slData.angles;
    this.sonicLevel.tileAnimations = slData.animations.map(tileData => {
      const tileAnimation = new TileAnimationData();
      tileAnimation.animationTileFile = tileData.animationFile;
      tileAnimation.animationTileIndex = tileData.animationTileIndex;
      tileAnimation.numberOfTiles = tileData.numberOfTiles;
      tileAnimation.dataFrames = tileData.frames.map(frameData => {
        const frame = new TileAnimationDataFrame();
        frame.ticks = frameData.ticks;
        frame.startingTileIndex = frameData.startingTileIndex;
        return frame;
      });
      return tileAnimation;
    });

    this.sonicLevel.collisionIndexes1 = slData.collisionIndexes1;
    this.sonicLevel.collisionIndexes2 = slData.collisionIndexes2;

    this.sonicLevel.heightMaps = slData.heightMaps.map((h, index) => new HeightMap(h, index));

    for (let j: number = 0; j < slData.chunks.length; j++) {
      const fc = slData.chunks[j];
      const mj = new TileChunk();
      mj.index = j;
      mj.tilePieces = new Array(8);
      for (let i: number = 0; i < 8; i++) {
        mj.tilePieces[i] = new Array(8);
      }
      for (let p: number = 0; p < fc.length; p++) {
        const tilePieceInfo = new TilePieceInfo();
        tilePieceInfo.index = p;
        tilePieceInfo.block = fc[p].block;
        tilePieceInfo.solid1 = fc[p].solid1;
        tilePieceInfo.solid2 = fc[p].solid2;
        tilePieceInfo.xFlip = fc[p].xFlip;
        tilePieceInfo.yFlip = fc[p].yFlip;

        mj.tilePieces[p % 8][(p / 8) | 0] = tilePieceInfo;
      }
      this.sonicLevel.tileChunks[j] = mj;
    }
    this.sonicLevel.palette = slData.palette.map(a =>
      a.map(col => {
        const r = parseInt(col.slice(0, 2), 16);
        const g = parseInt(col.slice(2, 4), 16);
        const b = parseInt(col.slice(4, 6), 16);

        return (255 << 24) | (b << 16) | (g << 8) | r;
      })
    );

    this.sonicLevel.startPositions = slData.startPositions.map(a => new Point(a.x, a.y));
    this.sonicLevel.animatedPalettes = [];

    if (slData.paletteItems.length > 0) {
      const length = slData.paletteItems[0].length;
      for (let k = 0; k < length; k++) {
        const pal = slData.paletteItems[0][k];

        const animatedPalette = new PaletteItem();
        animatedPalette.palette = (eval(pal.palette) as string[]).map(col => {
          const r = parseInt(col.slice(0, 2), 16);
          const g = parseInt(col.slice(2, 4), 16);
          const b = parseInt(col.slice(4, 6), 16);
          return (255 << 24) | (b << 16) | (g << 8) | r;
        });
        animatedPalette.skipIndex = pal.skipIndex;
        animatedPalette.totalLength = pal.totalLength;
        animatedPalette.pieces = pal.pieces.map(a => {
          const piece = new PaletteItemPieces();
          piece.paletteIndex = a.paletteIndex;
          piece.paletteMultiply = a.paletteMultiply;
          piece.paletteOffset = a.paletteOffset;
          return piece;
        });
        this.sonicLevel.animatedPalettes.push(animatedPalette);
      }
    }
    for (const tilePiece of this.sonicLevel.tilePieces) {
      for (const tileInfo of tilePiece.tiles) {
        const tile = tileInfo.getTile();
        if (!tile) {
          continue;
        }

        tile.animatedTileIndex = null;
        for (
          let tileAnimationIndex = 0;
          tileAnimationIndex < this.sonicLevel.tileAnimations.length;
          tileAnimationIndex++
        ) {
          const tileAnimationData = this.sonicLevel.tileAnimations[tileAnimationIndex];
          const anin = tileAnimationData.animationTileIndex;
          const num = tileAnimationData.numberOfTiles;
          if (tile.index >= anin && tile.index < anin + num) {
            tile.animatedTileIndex = tileAnimationIndex;
          }
        }
      }
    }

    for (const chunk of this.sonicLevel.tileChunks) {
      chunk.checkEmpty();
      chunk.checkOnlyBackground();
      chunk.checkOnlyForeground();
    }
    this.tilePaletteAnimationManager = new TilePaletteAnimationManager(this);
    this.tileAnimationManager = new TileAnimationManager(this);

    this.engine.preloadSprites(
      () => {
        this.loading = false;
        this.resize();
      },
      s => {}
    );
    this.resize();
  }
}

export const UINT32ARRAY_ID = idof<Uint32Array>();
export const INT32ARRAY_ID = idof<Int32Array>();
export const Uint8Array_ID = idof<Uint8Array>();

// tslint:disable:prefer-for-of
memory.grow(50);

export function doit(): void {
  const value: i32 = -16724788;
  store<u8>(0, 50);
  store<u8>(1, 50);
  store<u8>(2, 50);
  store<u8>(3, 50);
  store<u8>(4, 50);
  // trace('h1', 4, load<i32>(0));
  // trace('h1', 4, load<i32>(1));
  // trace('h1', 4, load<i32>(2));
  // trace('h1', 4, load<i32>(3));
}

export function setNumbers(
  foregroundWidth: u16,
  foregroundHeight: u16,
  foreground: u8[][],
  tileCount: u16,
  tilePieceCount: u16,
  chunkCount: u16
): void {
  sonicLevel.levelWidth = foregroundWidth;
  sonicLevel.levelHeight = foregroundHeight;

  MemoryBuffer.setTileCount(tileCount);
  MemoryBuffer.setForegroundSize(foregroundWidth, foregroundHeight);
  MemoryBuffer.setLayerBufferSize(320 + 16 * 2, 224 + 16 * 2);

  MemoryBuffer.tilePieceCount = tilePieceCount;
  MemoryBuffer.chunkCount = chunkCount;

  for (let x = 0; x < foreground.length; x++) {
    for (let y = 0; y < foreground[x].length; y++) {
      MemoryBuffer.storeForeground(foregroundWidth, u16(x), u16(y), foreground[x][y]);
    }
  }

  // sonicLevel.chunkMap = foreground;
}

const chunkSize = 8;
const tilePieceSize = 8;

export class MemoryBuffer {
  static tileSize: u8 = u8(sizeof<u8>() * 8 * 8);

  static tileCount: u16;
  static tilePieceCount: u16;
  static chunkCount: u16;

  static tileOffset: u16;
  static foregroundOffset: u16;

  static tilePieceOffset: u16;
  static chunkOffset: u16;

  static foregroundWidth: u16;
  static foregroundHeight: u16;

  static layerBufferWidth: u16;
  static layerBufferHeight: u16;

  static setTileCount(tileCount: u16): void {
    this.tileCount = tileCount;
    this.tileOffset = this.tileSize * (tileCount + 8 * 8);
  }

  static setForegroundSize(foregroundWidth: u16, foregroundHeight: u16): void {
    MemoryBuffer.foregroundWidth = foregroundWidth;
    MemoryBuffer.foregroundHeight = foregroundHeight;
    MemoryBuffer.foregroundOffset = MemoryBuffer.tileOffset + foregroundWidth * foregroundHeight;
  }

  static setLayerBufferSize(width: u16, height: u16): void {
    MemoryBuffer.layerBufferWidth = width;
    MemoryBuffer.layerBufferHeight = height;
  }

  @inline
  static storeLowBuffer(index: u32, pixel: i32): void {
    store<i32>(MemoryBuffer.foregroundOffset + index * 4, pixel);
    // const result = load<i32>(MemoryBuffer.foregroundOffset + 3 + index * 4);
    // trace('low', 4, pixel, MemoryBuffer.foregroundOffset + 3, MemoryBuffer.foregroundOffset + 3 + index * 4);
  }

  @inline
  static storeHighBuffer(index: u32, pixel: i32): void {
    /*    store<i32>(
      MemoryBuffer.foregroundOffset +
        MemoryBuffer.layerBufferWidth * MemoryBuffer.layerBufferHeight * 4 +
        index * 4,
      pixel
    );*/
  }

  static clearBuffers(): void {}

  @inline
  static storeTileColor(tileIndex: u16, x: u8, y: u8, color: u8): void {
    store<u8>(MemoryBuffer.tileSize * tileIndex + (y * 8 + x), color);
  }
  @inline
  static getTileColor(tileIndex: u16, x: u8, y: u8): u8 {
    return load<u8>(MemoryBuffer.tileSize * tileIndex + (y * 8 + x));
  }

  @inline
  static storeForeground(foregroundWidth: u16, x: u16, y: u16, item: u8): void {
    store<u8>(MemoryBuffer.tileOffset + (y * foregroundWidth + x), item);
  }
  @inline
  static getForeground(foregroundWidth: u16, x: u16, y: u16): u8 {
    return load<u8>(MemoryBuffer.tileOffset + (y * foregroundWidth + x));
  }
}

export function addTile(tileIndex: u16, colors: u8[][]): void {
  for (let x: u8 = 0; x < 8; x++) {
    for (let y: u8 = 0; y < 8; y++) {
      MemoryBuffer.storeTileColor(tileIndex, x, y, colors[x][y]);
    }
  }
  // sonicLevel.tiles[tileIndex] = new Tile(colors);
  // sonicLevel.tiles[tileIndex].index = tileIndex;
}

export function setBuffers(low: Uint32Array, high: Uint32Array): void {
  sonicLevel.bufferLow = low;
  sonicLevel.bufferHigh = high;
}

export function make2d(rows: i32, cols: i32, flatArray: Int32Array): i32[][] {
  //  gtrace('sizez', 1, __heap_base);
  const m = new Array<i32[]>(rows);
  for (let x = 0; x < rows; x++) {
    m[x] = new Array<i32>(cols);
    for (let i = 0; i < cols; i++) {
      m[x][i] = flatArray[x * cols + i];
    }
  }

  return m;
}
export function make2du8(rows: i32, cols: i32, flatArray: Uint8Array): u8[][] {
  //  gtrace('sizea', 1 /*__heap_base);*/);
  const m = new Array<u8[]>(rows);
  for (let x = 0; x < rows; x++) {
    m[x] = new Array<u8>(cols);
    for (let i = 0; i < cols; i++) {
      m[x][i] = flatArray[x * cols + i];
    }
  }
  //  gtrace('sizeb', 1 /*__heap_base);*/);
  return m;
}

export function addTilePiece(tilePieceIndex: u16): void {
  const tilePiece = new TilePiece();
  tilePiece.index = tilePieceIndex;
  tilePiece.tiles = [];
  sonicLevel.tilePieces[tilePieceIndex] = tilePiece;
}
export function addTileChunk(tileChunkIndex: i32): void {
  const mj = new TileChunk();
  mj.index = tileChunkIndex;
  mj.tilePieces = new Array(8);
  for (let i = 0; i < 8; i++) {
    mj.tilePieces[i] = new Array(8);
  }
  sonicLevel.tileChunks[tileChunkIndex] = mj;
}

export function setPalette(palette: i32[][]): void {
  sonicLevel.palette = palette;
}

export function addTileChunkTilePieceInfo(
  tileChunkIndex: i32,
  x: i32,
  y: i32,
  pieceInfoIndex: i32,
  block: i32,
  solid1: i32,
  solid2: i32,
  xFlip: boolean,
  yFlip: boolean
): void {
  const chunk = sonicLevel.tileChunks[tileChunkIndex];

  const tilePieceInfo = new TilePieceInfo();
  tilePieceInfo.index = pieceInfoIndex;
  tilePieceInfo.block = block;
  tilePieceInfo.solid1 = solid1;
  tilePieceInfo.solid2 = solid2;
  tilePieceInfo.xFlip = xFlip;
  tilePieceInfo.yFlip = yFlip;

  chunk.tilePieces[x][y] = tilePieceInfo;
}
export function addTileToPiece(
  tilePieceIndex: u16,
  tileIndex: u16,
  priority: boolean,
  xFlip: boolean,
  yFlip: boolean,
  palette: u8
): void {
  const tilePiece = sonicLevel.tilePieces[tilePieceIndex];

  const tileInfo = new TileInfo();
  tileInfo.tileIndex = tileIndex;
  tileInfo.priority = priority;
  tileInfo.xFlip = xFlip;
  tileInfo.yFlip = yFlip;
  tileInfo.palette = palette;
  tilePiece.tiles.push(tileInfo);
}

export function drawChunksPixel(windowX: i32, windowY: i32): void {
  const levelWidthPixels: i32 = sonicLevel.levelWidth * 128;
  const levelHeightPixels: i32 = sonicLevel.levelHeight * 128;

  windowX = mod(windowX - 16, levelWidthPixels);
  windowY = mod(windowY - 16, levelHeightPixels);

  // const bufferLow = sonicLevel.bufferLow;
  // const bufferHigh = sonicLevel.bufferHigh;

  MemoryBuffer.clearBuffers();
  // bufferLow.fill(0);
  // bufferHigh.fill(0);

  const endX = windowX + 320 + 16 * 2;
  const endY = windowY + 224 + 16 * 2;

  let drawX: u16 = 0;
  let drawY: u16 = 0;

  const bufferSize = u32(MemoryBuffer.layerBufferHeight * MemoryBuffer.layerBufferWidth);
  gtrace('a');
  for (let x = windowX; x < endX; x++) {
    gtrace('b');
    const repositionedX = mod(x, levelWidthPixels);
    drawX += 1;
    drawY = 0;
    for (let y = windowY; y < endY; y++) {
      gtrace('c');
      const repositionedY = mod(y, levelHeightPixels);
      drawY += 1;
      gtrace('c1');

      const chunkX = u16((repositionedX / 128) | 0);
      const chunkY = u16((repositionedY / 128) | 0);
      gtrace('c2');

      const chunk = sonicLevel.getChunkAt(chunkX, chunkY);
      gtrace('c3');
      /*      if (chunk === undefined) {
                  continue;
                }*/
      if (chunk.isEmpty) {
        continue;
      }
      gtrace('d');

      const tilePieceX = ((repositionedX / 16) | 0) - chunkX * 8;
      const tilePieceY = ((repositionedY / 16) | 0) - chunkY * 8;

      const tpX = chunk.tilePieces[tilePieceX];
      /*      if (tpX === undefined) {
        continue;
      }*/
      gtrace('e');
      const pieceInfo = tpX[tilePieceY];
      /*    if (pieceInfo === undefined) {
        continue;
      }
  */
      gtrace('f');
      const piece = pieceInfo.getTilePiece();
      /*  if (piece === undefined) {
        continue;
      }
    */
      gtrace('g');

      const drawOrderIndex = pieceInfo.xFlip ? (pieceInfo.yFlip ? 0 : 1) : pieceInfo.yFlip ? 2 : 3;
      gtrace('g1');

      const tileX = ((repositionedX / 8) | 0) - chunkX * 16 - tilePieceX * 2;
      gtrace('g2');
      const tileY = ((repositionedY / 8) | 0) - chunkY * 16 - tilePieceY * 2;
      gtrace('g3');
      const drawOrder = TilePiece.drawOrder[drawOrderIndex];
      gtrace('g4', 2, x, y);
      const tileIndex = tileY * 2 + tileX;
      gtrace('g5', 1, tileIndex);
      const tileNumber = drawOrder[tileIndex];
      gtrace('g6');
      const tileItem = piece.tiles[tileNumber];
      gtrace('g7');

      // const tile = tileItem.getTile();
      gtrace('h');

      const palette_ = sonicLevel.palette;
      const colorPaletteIndex = tileItem.palette;

      const pixelX = u8(repositionedX - (chunkX * 128 + tilePieceX * 16 + tileX * 8));
      const pixelY = u8(repositionedY - (chunkY * 128 + tilePieceY * 16 + tileY * 8));

      const color = MemoryBuffer.getTileColor(tileItem.tileIndex, pixelX, pixelY);
      gtrace('i');
      /* if (color === 0) {
          continue;
        }*/
      const colorIndex = color;

      if (colorIndex === 0) {
        continue;
      }

      let iX: u32;
      let iY: u32;
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
      gtrace('j');

      const index = iY * (320 + 16 * 2) + iX;
      const value = palette_[colorPaletteIndex][colorIndex];
      gtrace('k');
      if (index < bufferSize) {
        if (!tileItem.priority) {
          gtrace('l');
          MemoryBuffer.storeLowBuffer(index, value);
        } else {
          gtrace('m');
          // MemoryBuffer.storeLowBuffer(index, value);
          // MemoryBuffer.storeHighBuffer(index, value);
        }
      } else {
        //trace('m10', 2, index, bufferSize);
      }
    }
  }
  // this.engine.lowTileCanvas.context.putImageData(this.lowCacheImageData, -17, -17);
  // this.engine.highTileCanvas.context.putImageData(this.highCacheImageData, -17, -17);
}

export class TileChunk {
  isOnlyBackground: boolean;
  isOnlyForeground: boolean;
  isEmpty: boolean;
  tilePieces: TilePieceInfo[][];
  index: i32;

  constructor() {}

  getTilePieceAt(x: i32, y: i32, large: boolean): TilePiece {
    return this.getTilePieceInfo(x, y, large).getTilePiece();
  }

  setTilePieceAt(x: i32, y: i32, tp: TilePiece, large: boolean): void {
    this.getTilePieceInfo(x, y, large).setTilePiece(tp);
  }

  getTilePieceInfo(x: i32, y: i32, large: boolean): TilePieceInfo {
    if (large) {
      return this.tilePieces[(x / 16) | 0][(y / 16) | 0];
    } else {
      return this.tilePieces[x][y];
    }
  }

  checkOnlyBackground(): void {
    const pieces = this.eachPiece();
    for (let i = 0; i < pieces.length; i++) {
      const tilePiece = pieces[i];
      if (!tilePiece.isOnlyBackground) {
        this.isOnlyBackground = false;
        return;
      }
    }
    this.isOnlyBackground = true;
  }

  checkOnlyForeground(): void {
    const pieces = this.eachPiece();
    for (let i = 0; i < pieces.length; i++) {
      const tilePiece = pieces[i];
      if (!tilePiece.isOnlyForeground) {
        this.isOnlyForeground = false;
        return;
      }
    }
    this.isOnlyForeground = true;
  }

  checkEmpty(): void {
    const pieces = this.eachPiece();
    for (let i = 0; i < pieces.length; i++) {
      const tilePiece = pieces[i];
      if (tilePiece.index !== 0) {
        this.isEmpty = false;
        return;
      }
    }
    this.isEmpty = true;
  }

  private eachPiece(): TilePiece[] {
    const __result: TilePiece[] = [];
    for (let pieceY = 0; pieceY < 8; pieceY++) {
      for (let pieceX = 0; pieceX < 8; pieceX++) {
        const tilePiece: TilePiece = this.tilePieces[pieceX][pieceY].getTilePiece();
        if (tilePiece != null) {
          __result.push(tilePiece);
        }
      }
    }
    return __result;
  }
}

class TilePieceInfo {
  block: i32 = 0;
  xFlip: boolean = false;
  yFlip: boolean = false;
  solid1: Solidity = Solidity.NotSolid;
  solid2: Solidity = Solidity.NotSolid;

  index: i32 = 0;
  getTilePiece(): TilePiece {
    return sonicLevel.getTilePiece(this.block);
  }
  setTilePiece(tp: TilePiece): boolean {
    if (this.block === tp.index) {
      return false;
    }
    this.block = tp.index;
    return true;
  }
}

export class TilePiece {
  static drawInfo: u8[][] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1]
  ];
  static drawOrder: u8[][] = [
    [3, 2, 1, 0],
    [1, 0, 3, 2],
    [2, 3, 0, 1],
    [0, 1, 2, 3]
  ];
  isOnlyBackground: boolean = false;
  isOnlyForeground: boolean = false;

  tiles: TileInfo[];

  index: u16 = 0;

  init(): void {
    this.checkOnlyForeground();
    this.checkOnlyBackground();
  }

  checkOnlyBackground(): void {
    for (let i = 0; i < this.tiles.length; i++) {
      const mj = this.tiles[i];
      if (/*mj && */ mj.priority) {
        this.isOnlyBackground = false;
        return;
      }
    }
    this.isOnlyBackground = true;
  }

  checkOnlyForeground(): void {
    for (let i = 0; i < this.tiles.length; i++) {
      const mj = this.tiles[i];
      if (/*mj && */ !mj.priority) {
        this.isOnlyForeground = false;
        return;
      }
    }
    this.isOnlyForeground = true;
  }
}
enum Solidity {
  NotSolid = 0,
  TopSolid = 1,
  LRBSolid = 2,
  AllSolid = 3
}

export class TileInfo {
  tileIndex: u16 = 0;
  priority: boolean = false;
  xFlip: boolean = false;
  yFlip: boolean = false;
  palette: u8 = 0;

  /*
  @inline
  getTile(): Tile {
    const tile = sonicLevel.getTile(this.tileIndex);
    if (!tile) {
      return deadTile;
    }

    // if (SonicManager.instance.tileAnimationManager === undefined) {
    return tile;
    // }
    /!*
    if (tile.animatedTileIndex === -1) {
      return tile;
    }

    const tileAnimationFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(tile.animatedTileIndex);
    if (!tileAnimationFrame) {
      return tile;
    }
    const tileAnimation = tileAnimationFrame.animation;
    const tileAnimationData = tileAnimation.animatedTileData;
    const animationIndex = tileAnimationData.animationTileIndex;
    let frame = tileAnimationFrame.frameData();
    if (!frame) {
      frame = tileAnimation.animatedTileData.dataFrames[0];
    }
    const file = tileAnimationData.GetAnimationFile();
    const va = file[frame.startingTileIndex + (tile.index - animationIndex)];
    if (va != null) {
      return va;
    } else {
      return tile;
    }*!/
  }
*/
}

export class Tile {
  colors: u8[][];
  index: i32 = 0;
  animatedTileIndex: i32 = -1;

  constructor(colors: u8[][]) {
    this.colors = colors;
  }
}

export class SonicLevel {
  curHeightMap: boolean = false;
  levelWidth: u16 = 0;
  levelHeight: u16 = 0;
  curPaletteIndex: u8 = 0;

  palette: i32[][];
  // chunkMap: i32[][];
  tileAnimations: TileAnimationData[];
  animatedTileFiles: Tile[][];
  tileChunks: TileChunk[];
  // tiles: Tile[];
  tilePieces: TilePiece[];
  animatedPalettes: PaletteItem[];
  bufferLow: Uint32Array;
  bufferHigh: Uint32Array;

  constructor() {
    // this.tiles = [];
    this.tilePieces = [];
    this.tileChunks = [];
    // this.chunkMap = [];
    this.curHeightMap = true;
    this.curPaletteIndex = 0;
    this.levelWidth = 0;
    this.levelHeight = 0;
  }

  @inline
  getChunkAt(x: u16, y: u16): TileChunk {
    const chunk = MemoryBuffer.getForeground(this.levelWidth, x, y);
    return this.tileChunks[chunk];
  }
  /*
  @inline
  getTile(tile: i32): Tile {
    return this.tiles[tile];
  }
*/

  @inline
  getTilePiece(block: i32): TilePiece {
    return this.tilePieces[block];
  }
}

export class PaletteItem {
  palette: i32[];
  skipIndex: i32 = 0;
  totalLength: i32 = 0;
  pieces: PaletteItemPieces[];
}

export class PaletteItemPieces {
  paletteIndex: i32 = 0;
  paletteMultiply: i32 = 0;
  paletteOffset: i32 = 0;
}

export class TileAnimationData {
  animationTileFile: i32 = 0;
  numberOfTiles: i32 = 0;
  lastAnimatedIndex: i32 = 0;
  lastAnimatedFrame: i32 = 0;
  animationTileIndex: i32 = 0;
  dataFrames: TileAnimationDataFrame[];
  constructor() {}
  GetAnimationFile(): Tile[] {
    return sonicLevel.animatedTileFiles[this.animationTileFile];
  }
}
export class TileAnimationDataFrame {
  ticks: i32 = 0;
  startingTileIndex: i32 = 0;
}

const sonicLevel = new SonicLevel();
const deadTile = new Tile([]);
deadTile.index = -1;

@inline
function mod(j: i32, n: i32): i32 {
  return ((j % n) + n) % n;
}

function gtrace(msg: string, n: i32 = 0, a0: f64 = 0, a1: f64 = 0, a2: f64 = 0, a3: f64 = 0, a4: f64 = 0): void {
  // trace(msg, n, a0, a1, a2, a3, a4);
}

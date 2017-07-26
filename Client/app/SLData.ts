export interface SLData {
    paletteItems: AnimatedPaletteItem[][];
    startPositions: SLDataStartPositionEntry[];
    animatedFiles: number[][][];
    animations: SLDataAnimation[];
    tiles: number[][];
    blocks: SLDataPatternIndex[][];
    chunks: SLDataChunkBlock[][];
    foreground: number[][];
    foregroundWidth: number;
    foregroundHeight: number;
    background: number[][];
    backgroundWidth: number;
    backgroundHeight: number;
    palette: string[][];
    objects: SLDataObjectEntry[];
    objectFormat: string;
    rings: SLDataRingEntry[];
    ringFormat: string;
    cNZBumpers: SLDataCNZBumperEntry[];
    collisionIndexes1: number[];
    collisionIndexes2: number[];
    heightMaps: number[][];
    angles: number[];
}

export interface AnimatedPaletteItem {
    skipIndex: number;
    totalLength: number;
    palette: string;
    pieces: AnimatedPalettePiece[];
}

export interface AnimatedPalettePiece {
    paletteMultiply: number;
    paletteOffset: number;
    paletteIndex: number;
}

export interface SLDataRingEntry {
    x: number;
    y: number;
}

export interface SLDataCNZBumperEntry {
    id: number;
    x: number;
    y: number;
}

export enum Solidity {
    NotSolid = 0,
    TopSolid = 1,
    LRBSolid = 2,
    AllSolid = 3
}

export interface SLDataChunkBlock {
    solid1: Solidity;
    solid2: Solidity;
    xFlip: boolean;
    yFlip: boolean;
    block: number;
}

export interface SLDataObjectEntry {
    x: number;
    y: number;
    yFlip: boolean;
    xFlip: boolean;
    iD: number;
    subType: number;
}

export interface SLDataStartPositionEntry {
    x: number;
    y: number;
    type: string;
}

export interface SLDataAnimation {
    animationFile: number;
    animationTileIndex: number;
    numberOfTiles: number;
    frames: SLDataAnimationFrame[];
}

export interface SLDataAnimationFrame {
    startingTileIndex: number;
    ticks: number;
}

export interface SLDataPatternIndex {
    priority: boolean;
    palette: number;
    xFlip: boolean;
    yFlip: boolean;
    tile: number;
}

export interface ObjectModelData {
    name: string;
    data: string;
}
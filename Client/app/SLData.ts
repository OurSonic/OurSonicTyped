export class SLData {
    public PaletteItems:AnimatedPaletteItem[][];
    public StartPositions:SLDataStartPositionEntry[];
    public AnimatedFiles:number[][][];
    public Animations:SLDataAnimation[];
    public Tiles:number[][];
    public Blocks:SLDataPatternIndex[][];
    public Chunks:SLDataChunkBlock[][];
    public Foreground:number[][];
    public ForegroundWidth:number;
    public ForegroundHeight:number;
    public Background:number[][];
    public BackgroundWidth:number;
    public BackgroundHeight:number;
    public Palette:string[][];
    public Objects:SLDataObjectEntry[];
    public ObjectFormat:string;
    public Rings:SLDataRingEntry[];
    public RingFormat:string;
    public CNZBumpers:SLDataCNZBumperEntry[];
    public CollisionIndexes1:number[];
    public CollisionIndexes2:number[];
    public HeightMaps:number[][];
    public Angles:number[];
    constructor() {
    }
}
export class AnimatedPaletteItem {
    public SkipIndex:number;
    public TotalLength:number;
    public Palette:string;
    public Pieces:AnimatedPalettePiece[];
    constructor() {
    }
}
export class AnimatedPalettePiece {
    public PaletteMultiply:number;
    public PaletteOffset:number;
    public PaletteIndex:number;
    constructor() {
    }
}
export class SLDataRingEntry {
    public X:number;
    public Y:number;
    constructor() {
    }
}
export class SLDataCNZBumperEntry {
    public ID:number;
    public X:number;
    public Y:number;
    constructor() {
    }
}
export enum Solidity {
    NotSolid = 0,
    TopSolid = 1,
    LRBSolid = 2,
    AllSolid = 3
}
export class SLDataChunkBlock {
    public Solid1:Solidity;
    public Solid2:Solidity;
    public XFlip:boolean;
    public YFlip:boolean;
    public Block:number;
    constructor() {
    }
}
export class SLDataObjectEntry {
    public X:number;
    public Y:number;
    public YFlip:boolean;
    public XFlip:boolean;
    public ID:number;
    public SubType:number;
    constructor() {
    }
}
export class SLDataStartPositionEntry {
    public X:number;
    public Y:number;
    public Type:string;
    constructor() {
    }
}
export class SLDataAnimation {
    public AutomatedTiming:number;
    public AnimationFile:number;
    public AnimationTileIndex:number;
    public NumberOfTiles:number;
    public Frames:SLDataAnimationFrame[];
    constructor() {
    }
}
export class SLDataAnimationFrame {
    public StartingTileIndex:number;
    public Ticks:number;
    constructor() {
    }
}
export class SLDataPatternIndex {
    public Priority:boolean;
    public Palette:number;
    public XFlip:boolean;
    public YFlip:boolean;
    public Tile:number;
    constructor() {
    }
}
export class ObjectModelData {
    public Name:string;
    public Data:string;
}
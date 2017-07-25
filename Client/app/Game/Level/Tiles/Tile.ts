import {CanvasInformation} from "../../../common/CanvasInformation";
import {Point} from "../../../common/Utils";
import {SonicManager} from "../../SonicManager";

export class Tile {
    private canAnimate: boolean = true;
    protected curPaletteIndexes: number[];
    colors: number[][];
    public index: number = 0;
    public isTileAnimated: boolean = false;
    public animatedTileIndex: number = null;
    public paletteIndexesToBeAnimated: { [key: number]: number[] };

    constructor(colors: number[][]) {
        this.colors = colors;
        this.curPaletteIndexes = null;
    }


    public ShouldTileAnimate(): boolean {
        return this.isTileAnimated && this.canAnimate;
    }

    public GetAllPaletteIndexes(): number[] {
        let d: number[] = [];
        for (let _x: number = 0; _x < this.colors.length; _x++) {
            let color = this.colors[_x];
            for (let _y: number = 0; _y < color.length; _y++) {
                let col = color[_y];
                if (col == 0)
                    continue;
                if (d.filter(a => a != col).length === d.length)
                    d.push(col);
            }
        }
        return d;
    }

}
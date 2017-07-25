import {CanvasInformation} from "../../../common/CanvasInformation";
import {Point} from "../../../common/Utils";
import {SonicManager} from "../../SonicManager";

export class Tile {
    protected curPaletteIndexes: number[];
    colors: number[][];
    public index: number = 0;
    public animatedTileIndex: number = null;

    constructor(colors: number[][]) {
        this.colors = colors;
        this.curPaletteIndexes = null;
    }




    public getImage(xFlip: boolean = false, yFlip: boolean = false, colorPaletteIndex: number = 0): CanvasInformation {
        let info = CanvasInformation.create(8, 8, true);
        let image = info.context.getImageData(0, 0, 8, 8);
        let buffer = new Uint32Array(image.data.buffer);
        let palette = SonicManager.instance.sonicLevel.palette;

        for (let x = 0; x < 8; x++) {
            let drawX = x;
            if (xFlip) {
                drawX = 7 - x;
            }

            let color = this.colors[x];
            for (let y = 0; y < 8; y++) {

                let drawY = y;
                if (yFlip) {
                    drawY = 7 - y;
                }

                let col = color[drawY];
                if (col == 0)
                    continue;

                buffer[y * 8 + x] = palette[colorPaletteIndex][col]
            }
        }
        info.context.putImageData(image, 0, 0)
        return info;
    }

}
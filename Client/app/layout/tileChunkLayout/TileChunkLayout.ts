import {Component} from '@angular/core';
import {SonicManager} from "../../game/SonicManager";

@Component({
    selector: 'tile-chunk',
    templateUrl: 'app/layout/tileChunkLayout/tileChunkLayout.html',
})
export class TileChunkLayout {
    tileChunks: string[];

    ngOnInit() {
        this.tileChunks = SonicManager.instance.sonicLevel.tileChunks.map(a => a.getImage().canvas.toDataURL());
    }

}
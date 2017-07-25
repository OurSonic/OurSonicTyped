import {Component} from '@angular/core';
import {SonicManager} from "../../game/SonicManager";

@Component({
    selector: 'tiles',
    templateUrl: 'app/layout/tileLayout/tileLayout.html',
})
export class TileLayout {
    tiles: string[];

    ngOnInit() {
        this.tiles = SonicManager.instance.sonicLevel.tiles.map(a => a.getImage().canvas.toDataURL());
    }

}
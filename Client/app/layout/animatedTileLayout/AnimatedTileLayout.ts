import {Component} from '@angular/core';
import {SonicManager} from "../../game/SonicManager";

@Component({
    selector: 'animated-tiles',
    templateUrl: 'app/layout/animatedTileLayout/animatedTileLayout.html',
})
export class AnimatedTileLayout {
    tiles: string[][];
    paletteIndex: number = 0;

    ngOnInit() {
        this.tiles = SonicManager.instance.sonicLevel.animatedTileFiles.map(a => a.map(b => b.getImage(false, false, this.paletteIndex).canvas.toDataURL()));
    }

    updateTiles(newIndex: number) {
        this.paletteIndex = newIndex;
        this.tiles = SonicManager.instance.sonicLevel.animatedTileFiles.map(a => a.map(b => b.getImage(false, false, this.paletteIndex).canvas.toDataURL()));
    }
}
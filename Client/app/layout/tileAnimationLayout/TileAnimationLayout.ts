import {Component} from '@angular/core';
import {SonicEngine} from "../../Game/SonicEngine";
import {SonicManager} from "../../Game/SonicManager";
import {TileAnimation} from "../../Game/Level/Tiles/TileAnimationManager";

@Component({
    selector: 'tile-animation-layout',
    templateUrl: 'app/layout/tileAnimationLayout/tileAnimationLayout.html',
})
export class TileAnimationLayout {
    public static instance: TileAnimationLayout;
    public layoutVisible = false;
    private sonicManager: SonicManager;
    private tileAnimations;

    constructor() {
        TileAnimationLayout.instance = this;
    }

    loadLevel(sonicManager: SonicManager) {
        this.layoutVisible = true;
        this.sonicManager = sonicManager;
        var animations :TileAnimation[]= [];
        for (let key in this.sonicManager.tileAnimationManager.Animations) {
            animations[key] = this.sonicManager.tileAnimationManager.Animations[key];
        }
        this.tileAnimations = animations[0].frames[0].frameData();
    }
}
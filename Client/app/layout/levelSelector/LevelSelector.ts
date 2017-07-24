import {Component, OnInit, Input} from '@angular/core';
import {LevelService, SonicLevelData} from "../services/LevelService";
import {SonicEngine} from "../../game/SonicEngine";
import {TileAnimationLayout} from "../tileAnimationLayout/TileAnimationLayout";
import {Layout} from "../Layout";

@Component({
    selector: 'level-selector',
    templateUrl: 'app/layout/levelSelector/levelSelector.html',
    //    viewProviders: [WindowComponent],
    providers: [LevelService]
})
export class LevelSelector implements OnInit {
    @Input() public layout: Layout;
    levels: SonicLevelData[];
    constructor(private _levelService: LevelService) {
    }

    ngOnInit() {
        this._levelService.getLevels().subscribe(levels => {
            this.levels = levels;
        });
    }

    public loadLevel(level: SonicLevelData): void {
        this.layout.loading = true;

        document.getElementById('hiddenBox').focus();
        this._levelService.getLevel(level.name).subscribe(level => {
            SonicEngine.instance.loadLevel(level);
            this.layout.loading = false;
        });
    }
}
import {Component, OnInit, Input} from '@angular/core';
import {LevelService, SonicLevelData} from "../services/LevelService";
import {SonicEngine} from "../../game/SonicEngine";
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
    private loadedALevel: boolean;

    constructor(private _levelService: LevelService) {
    }

    ngOnInit() {
        this._levelService.getLevels().subscribe(levels => {
            this.levels = levels;
            if (!this.loadedALevel)
                this.loadLevel(this.levels[0]);
        });
    }

    public loadLevel(level: SonicLevelData): void {
        this.loadedALevel = true;
        this.layout.loading = true;

        document.getElementById('hiddenBox').focus();
        this._levelService.getLevel(level.name).subscribe(level => {
            SonicEngine.instance.loadLevel(level);
            this.layout.loading = false;
        });
    }
}
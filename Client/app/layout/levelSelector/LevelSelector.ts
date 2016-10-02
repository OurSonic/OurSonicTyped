import {Component, OnInit} from '@angular/core';
import {WindowComponent} from "../windowComponent/WindowComponent";
import {LevelService, SonicLevelData} from "../services/LevelService";
import {SonicEngine} from "../../game/SonicEngine";

@Component({
    selector: 'level-selector',
    templateUrl: 'app/layout/levelSelector/levelSelector.html',
    //    viewProviders: [WindowComponent],
    providers: [LevelService]
})
export class LevelSelector implements OnInit {
    levels: SonicLevelData[];
    loading: boolean = false;
    isMinimized:boolean=false;
    constructor(private _levelService: LevelService) {
    }

    ngOnInit() {
        this._levelService.getLevels().subscribe(levels => {
            this.levels = levels;
        });
    }

    public loadLevel(level: SonicLevelData): void {
        this.loading = true;
        this._levelService.getLevel(level.name).subscribe(level => {
            SonicEngine.instance.LoadLevel(level);
            this.isMinimized = true;
            this.loading = false;
        });
    }


    public closedWindow(done: boolean): void {
        console.log(done);
    }
}
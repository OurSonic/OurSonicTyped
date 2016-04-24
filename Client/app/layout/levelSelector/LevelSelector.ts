import {Component} from 'angular2/core';
import {WindowComponent} from "../windowComponent/WindowComponent";

@Component({
    selector: 'level-selector',
    templateUrl: 'app/layout/levelSelector/levelSelector.html',
    directives: [WindowComponent]
})
export class LevelSelector {

    public closedWindow(done:boolean):void{
        console.log(done);
        debugger;
    }
}
 
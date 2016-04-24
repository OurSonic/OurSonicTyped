import {Component} from 'angular2/core';
import {ObjectSelector} from "./objectSelector/ObjectSelector";
import {LevelSelector} from "./levelSelector/LevelSelector";
import 'rxjs/Rx';

@Component({
    selector: 'layout',
    templateUrl: 'app/layout/layout.html',
    directives:[ObjectSelector,LevelSelector]
})
export class Layout {

}
 
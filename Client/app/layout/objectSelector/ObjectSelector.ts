import {Component} from 'angular2/core';
import {WindowComponent} from '../windowComponent/WindowComponent'

@Component({
    selector: 'object-selector',
    templateUrl: 'app/layout/objectSelector/objectSelector.html',
    directives: [WindowComponent]
})
export class ObjectSelector {
}
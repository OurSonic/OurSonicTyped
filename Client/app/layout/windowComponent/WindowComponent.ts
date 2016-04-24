import {Component, ElementRef,Output, Input, EventEmitter} from 'angular2/core';
import {DraggableDirective} from "../directives/draggableDirective";


@Component({
    selector: 'window',
    templateUrl: 'app/layout/windowComponent/windowComponent.html',
    directives: [DraggableDirective],

})
export class WindowComponent {

    @Input() public visible:boolean;
    @Input() public width:string;
    @Input() public height:string;
    @Input() public left:string;
    @Input() public top:string;
    @Input() public visible:boolean;
    @Input() public windowTitle:string;

    @Output() public onclose:EventEmitter<boolean> = new EventEmitter();

    constructor(el:ElementRef) {
        this.visible = true;
    }

    public minimize():void {
        this.visible = false;
    }

    public maximize():void {
        this.visible = false;
    }

    public close():void {
        this.visible = false;
        this.onclose.emit(true);
    }
}
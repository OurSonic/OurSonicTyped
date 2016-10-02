import {Component, ElementRef,Output, Input, EventEmitter} from '@angular/core';
import {DraggableDirective} from "../directives/draggableDirective";


@Component({
    selector: 'window',
    templateUrl: 'app/layout/windowComponent/windowComponent.html',
//    viewProviders: [DraggableDirective],

})
export class WindowComponent {

    @Input() public visible:boolean;
    @Input() public width:string;
    @Input() public height:string;
    @Input() public left:string;
    @Input() public top:string;
    @Input() public windowTitle:string;
    @Input() public isMinimized:boolean;

    @Output() public onclose:EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(el:ElementRef) {
        this.visible = true;
    }

    public minimize():void {
        this.isMinimized = !this.isMinimized;
    }

    public maximize():void {
        this.visible = false;
    }

    public close():void {
        this.visible = false;
        this.onclose.emit(true);
    }
}
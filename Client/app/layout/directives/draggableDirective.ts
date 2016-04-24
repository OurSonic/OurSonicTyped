import {Directive, ElementRef, Inject} from 'angular2/core';

@Directive({
    selector: '[draggable]',
})
export class DraggableDirective {
    constructor(@(Inject) el:ElementRef) {
        (<any>$(el.nativeElement)).draggable({cancel: ".window .inner-window"});
    }
}
 
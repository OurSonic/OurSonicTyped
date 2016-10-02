import {Directive, ElementRef, Inject} from '@angular/core';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective {
    constructor(el:ElementRef) {
        (<any>$(el.nativeElement)).draggable({cancel: ".window .inner-window"});
    }
}
 
import {Directive, ElementRef, Inject} from '@angular/core';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective {
    constructor(el:ElementRef) {
        setTimeout(()=>{
            (<any>$(el.nativeElement)).drags({ handle:'.window-header'});
        },1)
    }
}
 
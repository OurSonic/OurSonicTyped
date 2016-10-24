import {Component} from '@angular/core';
import 'rxjs/Rx';

@Component({
    selector: 'layout',
    templateUrl: 'app/layout/layout.html',
//    viewProviders:[ObjectSelector,LevelSelector]
})
export class Layout {
    tabItems: {label: string,image: string}[] = [];
    selectedTabIndex: number = 0;
    title: string;
    loading: boolean;
    collapseSide: boolean;

    constructor() {
        this.title = '';
        this.tabItems = [
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Level Select'
            }
        ];
        this.tabClick(0);
    }

    tabClick(index: number) {
        this.selectedTabIndex = index;
        this.title = this.tabItems[this.selectedTabIndex].label;
        console.log(this.selectedTabIndex);
    }

    collapse(value:boolean) {
        this.collapseSide = value;
    }
}
 
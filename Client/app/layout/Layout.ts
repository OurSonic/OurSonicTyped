import {Component} from '@angular/core';
import 'rxjs/Rx';

@Component({
    selector: 'layout',
    templateUrl: 'app/layout/layout.html',
})
export class Layout {
    tabItems: { label: string, image: string }[] = [];
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
            },
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Object Select'
            },
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Tile Chunks'
            },
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Tile Pieces'
            },
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Tiles'
            },
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Animated Tiles'
            }
        ];
        this.tabClick(0);
    }

    tabClick(index: number) {
        this.selectedTabIndex = index;
        this.title = this.tabItems[this.selectedTabIndex].label;
    }

    collapse(value: boolean) {
        this.collapseSide = value;
    }
}
 
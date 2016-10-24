import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class LevelService {
    constructor(private http:Http) {
    }

    private _getLevelsUrl = 'https://api.oursonic.org/levels';
    private _getLevelUrl = 'https://api.oursonic.org/level';

    getLevels():Observable<SonicLevelData[]> {
        return this.http.get(this._getLevelsUrl)
            .map((res)=>res.json()) ;
    }

    getLevel(level:string):Observable<string> {
        return this.http.get(this._getLevelUrl + "?level=" + level)
            .map((res)=>res.json());
    }
}

export class SonicLevelData {
    public name:string;
}
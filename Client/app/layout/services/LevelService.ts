import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class LevelService {
    constructor(private http:Http) {
    }

    private _getLevelsUrl = 'http://localhost:8080/levels.json';

    getLevels():Observable<SonicLevelData[]> {
        return this.http.get(this._getLevelsUrl)
            .map((res)=>res.json());
    }
}

export class SonicLevelData {
    public name:string;
}
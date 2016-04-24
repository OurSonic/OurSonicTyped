import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class LevelService {
    constructor(private http:Http) {
    }

    private _getLevelsUrl = 'https://ju01nalc92.execute-api.us-west-2.amazonaws.com/prod/levels';
    private _getLevelUrl = 'https://ju01nalc92.execute-api.us-west-2.amazonaws.com/prod/level';

    getLevels():Observable<SonicLevelData[]> {
        return this.http.get(this._getLevelsUrl)
            .map((res)=>res.json());
    }


    getLevel(level:string):Observable<string> {
        return this.http.get(this._getLevelUrl+"?level="+level)
            .map((res)=>res.json());
    }

    
}

export class SonicLevelData {
    public name:string;
}
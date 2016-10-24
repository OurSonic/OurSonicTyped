import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class LevelService {
    private static  storedLevels: SonicLevelData[];

    constructor(private http: Http) {
    }

    private _getLevelsUrl = 'https://api.oursonic.org/levels';
    private _getLevelUrl = 'https://api.oursonic.org/level';

    getLevels(): Observable<SonicLevelData[]> {
        if (LevelService.storedLevels) {
            return new Observable((observer)=> observer.next(LevelService.storedLevels));
        } else {
            return this.http.get(this._getLevelsUrl)
                .map((res)=>res.json())
                .do((res)=> {
                    LevelService.storedLevels = res;
                });
        }
    }

    getLevel(level: string): Observable<string> {
        return this.http.get(this._getLevelUrl + "?level=" + level)
            .map((res)=>res.json());
    }
}

export class SonicLevelData {
    public name: string;
}
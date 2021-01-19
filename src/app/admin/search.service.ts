import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, delay, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class SearchService {

    baseUrl = 'https://api.cdnjs.com/libraries';
    queryUrl = '?search=';

    constructor(private http: HttpClient) { }

    search(terms: Observable<string>) {
        return terms.pipe(
            map((e) => e),
            // debounceTime(1000),
            distinctUntilChanged(),
            switchMap(search => this.searchEntries(search)));
    }

    searchEntries(term) {
        return this.http.get(this.baseUrl + this.queryUrl + term).pipe(map(res => res));
    }

}

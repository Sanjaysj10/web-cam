import { Component, OnInit } from '@angular/core';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { SearchService } from '../search.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [SearchService]
})
export class AdminComponent implements OnInit {

  results: Object;
  searchTerm$ = new Subject<string>();
  show = false;
  lang = environment.LANGUAGE;
  prod = environment.production;

  otherTerm$ = new Subject<string>();

  public subscription: Subscription;

  constructor(private searchService: SearchService) {

    this.subscription = this.otherTerm$.pipe(
      map((e) => e),
      debounceTime(1000),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(delay(500)))).subscribe(value => this.searchTerm$.next(value));

    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results;
      });

  }

  ngOnInit(): void {
  }

  changeResult(e) {
    this.searchTerm$.next(e);
  }

}

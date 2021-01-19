import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Output() changeResult = new EventEmitter();

  searchTerm$ = new Subject<string>();

  results$ = of([]);
  public subscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.subscription = this.searchTerm$.pipe(
      map((e) => e),
      debounceTime(1000),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(delay(500)))).subscribe(value => this.inputChange(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    console.log(this.data);
    this.results$ = of(this.data !== undefined || this.data !== null ? this.data.results : []);
  }

  inputChange(e) {
    this.changeResult.emit(e);
  }

}

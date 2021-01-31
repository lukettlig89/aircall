import { Component, OnInit } from '@angular/core';
import { StoreFacade } from '../../store/store.facade';
import { defaultItemPerPage } from '../../core/configs/defaults';
import { Filters } from './call/filters';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Call } from '../../core/models';
import { filterCalls } from './filter.utils';

@Component({
  selector: 'calls-cont',
  templateUrl: './calls-container.component.html',
  styleUrls: ['./calls-container.component.scss']
})
export class CallsContainerComponent implements OnInit {

  calls$ = this.facade.calls$;
  totalCalls$ = this.facade.totalCalls$;

  filteredCalls$?: Observable<Call[] | undefined>;
  defaultPageSize = defaultItemPerPage;

  constructor(
    private readonly facade: StoreFacade,
  ) { }

  ngOnInit(): void {
    this.filteredCalls$ = this.calls$;
  }

  applyFilters(filters: Filters[]): void {
    console.warn(filters);

    this.filteredCalls$ = from(this.facade.calls$)
      .pipe(
        map((calls) => filterCalls(filters, calls)),
        tap(console.warn)
      );
  }

}

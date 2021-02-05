import { Component, OnInit } from '@angular/core';
import { StoreFacade } from '../../store/store.facade';
import { defaultItemPerPage } from '../../core/configs/defaults';
import { Filters } from './call/filters';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Call } from '../../core/models';
import { filterCalls } from './filter.utils';
import { PageEvent } from '@angular/material/paginator';
import { isSameDay } from '../../core/utils/date-utils';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'calls-cont',
  templateUrl: './calls-container.component.html',
  styleUrls: ['./calls-container.component.scss']
})
export class CallsContainerComponent implements OnInit {

  totalCalls$ = this.facade.totalCalls$;

  // @ts-ignore
  filteredCalls$: Observable<Call[] | undefined>;
  defaultPageSize = defaultItemPerPage;

  constructor(
    private readonly facade: StoreFacade,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.filteredCalls$ = this.facade.calls$;
  }

  applyFilters(filters: Filters[]): void {
    this.filteredCalls$ = from(this.facade.calls$)
      .pipe(
        map((calls) => filterCalls(filters, calls)),
      );
  }

  pageChanged(pageEvent: PageEvent): void {
    const pageIncreased = pageEvent.pageIndex > (pageEvent.previousPageIndex ?? 0);
    const offset = pageIncreased
      ? ((pageEvent.previousPageIndex ?? 0) + 1) * pageEvent.pageSize
      : pageEvent.pageIndex * pageEvent.pageSize;
    const limit = pageEvent.pageSize;

    this.facade.retrieveCalls(offset, limit);
  }

  shouldDisplayDate$(index: number): Observable<boolean> {
    return from(this.filteredCalls$ as Observable<Call[]>)
      .pipe(
        map((calls) => {
          if (index === 0) {
            return true;
          }
          if (calls[index] === undefined || calls[index - 1] === undefined) {
            return false;
          }

          return !isSameDay(calls[index].created_at, calls[index - 1].created_at);
        })
      );
  }

  changeArchiveStatus(callId: string): void {
    this.facade.changeArchiveStatus(callId);
  }

  navigateToCall(callId: string): void {
    this.router.navigate(['/call', { id: callId }]);
  }
}

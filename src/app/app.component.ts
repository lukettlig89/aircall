import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreFacade } from './store/store.facade';
import Pusher from 'pusher-js';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Test Aircall';

  isLogged$ = this.facade.isLogged$;
  loading$ = this.facade.loading$;

  private readonly destroy = new Subject<void>();

  constructor(
    private readonly facade: StoreFacade,
  ) {}

  ngOnInit(): void {
    this.facade.token$
      .pipe(
        filter((token) => !isNil(token)),
        takeUntil(this.destroy),
      )
      .subscribe((token) => {
        const pusher = new Pusher(token as string, { authEndpoint: 'https://frontend-test-api.aircall.io/pusher/auth'});
        pusher.subscribe('private-aircall');

        pusher.connection.bind('update-call', (call: any) => {
          console.warn('call changes ', call);
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}

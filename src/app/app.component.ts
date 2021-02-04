import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreFacade } from './store/store.facade';
import Pusher from 'pusher-js';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { Call } from './core/models';
import { pusherKey } from './core/configs/defaults';

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
        this.createAndSubscribeToPusher(token as string);
      });
  }

  createAndSubscribeToPusher(token: string): void {
    const pusher = new Pusher(pusherKey, {
      cluster: 'eu',
      authEndpoint: 'https://frontend-test-api.aircall.io/pusher/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    });

    const channel = pusher.subscribe('private-aircall');

    channel.bind('update-call', (call: Call) => {
      this.facade.updateCall(call);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}

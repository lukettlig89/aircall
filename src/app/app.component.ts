import { Component } from '@angular/core';
import { StoreFacade } from './store/store.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Test Aircall';

  isLogged$ = this.facade.isLogged$;
  loading$ = this.facade.loading$;

  constructor(
    private readonly facade: StoreFacade,
  ) {}
}

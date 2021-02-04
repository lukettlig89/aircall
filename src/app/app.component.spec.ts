import { ComponentFixture, TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';
import { AppComponent } from './app.component';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject } from 'rxjs';
import { AppAction } from './store/actions';
import { initialState } from './store/state';
import { StoreFacade } from './store/store.facade';
import { AppModule } from './app.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const storeFacadeMock = mock(StoreFacade);
  const actions = new Subject<AppAction>();
  const tokenEvents = new Subject<string | undefined>();

  beforeEach(async () => {
    when(storeFacadeMock.token$).thenReturn(tokenEvents.asObservable());

    await TestBed.configureTestingModule({
      imports: [ AppModule, RouterTestingModule ],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions),
        { provide: StoreFacade, useFactory: () => instance(storeFacadeMock) }
      ]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and subscribe to the pusher when the token changes', (done) => {
    const spy = jest.spyOn(component, 'createAndSubscribeToPusher');

    tokenEvents.subscribe(() => {
      // then
      expect(spy).toHaveBeenCalledWith('my new token');
      done();
    });

    // when
    component.ngOnInit();
    tokenEvents.next('my new token');
  });
});

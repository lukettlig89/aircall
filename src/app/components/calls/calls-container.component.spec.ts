import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsContainerComponent } from './calls-container.component';
import { StoreFacade } from '../../store/store.facade';
import { instance, mock, when } from 'ts-mockito';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../store/state';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, Subject } from 'rxjs';
import { Call } from '../../core/models';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CallsContainerModule } from './calls-container.module';

describe('CallsComponent', () => {
  let component: CallsContainerComponent;
  let fixture: ComponentFixture<CallsContainerComponent>;
  const storeFacadeMock = mock(StoreFacade);
  const callsEvents = new Subject<Call[]>();

  beforeEach(async () => {
    when(storeFacadeMock.calls$).thenReturn(callsEvents.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        BrowserDynamicTestingModule,
        CallsContainerModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => of()),
        { provide: StoreFacade, useFactory: () => instance(storeFacadeMock) }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch the action retrieveCalls when the pagination changes', () => {
    // given
    const spy = spyOn(TestBed.inject(StoreFacade), 'retrieveCalls');

    // when
    component.pageChanged({ previousPageIndex: 0, pageIndex: 1, pageSize: 10, length: 200 });

    // then
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  it('should dispatch the action changeArchiveStatus when the archive status change', () => {
    // given
    const spy = spyOn(TestBed.inject(StoreFacade), 'changeArchiveStatus');

    // when
    component.changeArchiveStatus('call-id');

    // then
    expect(spy).toHaveBeenCalledWith('call-id');
  });

  describe('shouldDisplayDate$, ', () => {
    it('should return true when the compared calls has different days', (done) => {
      // given
      const calls = [
        { id: '1', created_at: '2021-01-29' },
        { id: '2', created_at: '2021-01-30' },
      ] as Call[];
      component.ngOnInit();

      // then
      component.shouldDisplayDate$(1)
        .subscribe((currentValue) => {
          expect(currentValue).toBeTruthy();
          done();
        });

      // when
      callsEvents.next(calls);
    });

    it('should return false when the compared calls are in the same day', (done) => {
      // given
      const calls = [
        { id: '1', created_at: '2021-02-01' },
        { id: '2', created_at: '2021-02-01' },
      ] as Call[];
      component.ngOnInit();

      // then
      component.shouldDisplayDate$(1)
        .subscribe((currentValue) => {
          expect(currentValue).toBeFalsy();
          done();
        });

      // when
      callsEvents.next(calls);
    });
  });
});

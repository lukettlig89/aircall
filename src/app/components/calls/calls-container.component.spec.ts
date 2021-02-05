import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('CallsComponent', () => {
  let component: CallsContainerComponent;
  let fixture: ComponentFixture<CallsContainerComponent>;
  const storeFacadeMock = mock(StoreFacade);
  const callsEvents = new Subject<Call[]>();

  const fakeRoutes = [
    { path: 'call', redirectTo: '/' },
  ];

  beforeEach(async () => {
    when(storeFacadeMock.calls$).thenReturn(callsEvents.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        BrowserDynamicTestingModule,
        CallsContainerModule,
        RouterTestingModule.withRoutes(fakeRoutes),
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

  it('should navigate to "/call" when clicking on call details', fakeAsync(() => {
    const spy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');

    // when
    component.navigateToCall('callId');
    tick();

    const spyParams: any = (spy.mock.calls[0][0] as any).root.children.primary.segments[0];

    // then
    expect(spyParams.path).toBe('call');
    expect(spyParams.parameters.id).toBe('callId');
  }));
});

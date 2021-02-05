import { TestBed, waitForAsync } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';
import { of, ReplaySubject } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialState, UserState } from './state';
import { provideMockActions } from '@ngrx/effects/testing';
import { Effects } from './effects';
import { RestRequestHelperService } from '../core/services/rest-request-helper.service';
import { ErrorService } from '../core/services/error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppAction, archiveCall, login, loginFailure, loginSuccess, retrieveCalls } from './actions';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchiveCallResponse, CallsResponse, LoginParams, LoginResponse } from '../core/models';
import { basePath, Routes } from '../core/configs/routes';
import { take } from 'rxjs/operators';

describe('Effects', () => {
  let store: MockStore;
  let effects: Effects;
  const actions = new ReplaySubject<AppAction>(1);
  const restRequestHelperMock = mock(RestRequestHelperService);

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ErrorService,
        Effects,
        provideMockActions(actions.asObservable()),
        provideMockStore({ initialState }),
        { provide: RestRequestHelperService, useFactory: () => instance(restRequestHelperMock) },
      ]
    })
    .compileComponents();

    effects = TestBed.inject(Effects);
    store = TestBed.inject(MockStore);
  }));

  describe('login', () => {

    it('should dispatch an action loginSuccess with payload', (done) => {
      const loginResponse = {
        access_token: 'token',
        user: { id: 'userId', username: 'username'},
      };
      when(restRequestHelperMock.post<LoginParams, LoginResponse>(anything(), anything()))
        .thenReturn(of(loginResponse));

      // given
      const user = { username: 'testuser', password: '1111'};

      effects.callLogin$.pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(action.type)
          .toBe('[Log in success]');
        expect(action.response)
          .toEqual({ access_token: loginResponse.access_token, userInfo: { ...loginResponse.user, password: user.password } });
        done();
      });

      // when
      actions.next(login({ data: user }));
    });

    it('should dispatch an action loginFailure and notify the error to the ui', (done) => {
      const spy = jest.spyOn(TestBed.inject(ErrorService), 'notifyError');
      const error = {
        status: 500,
        name: 'Unknown error',
        message: 'Error occurred on the server'
      };
      when(restRequestHelperMock.post<LoginParams, LoginResponse>(anything(), anything()))
        .thenThrow(error);

      // given
      const user = { username: 'testuser', password: '1111'};

      effects.callLogin$.pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(action.type)
          .toBe('[Log in failure]');
        expect(spy)
          .toHaveBeenCalledWith(error);
        done();
      });

      // when
      actions.next(login({ data: user }));
    });

    it('should show the loading distractor when login call is ongoing', (done) => {
      const loginResponse = {
        access_token: 'token',
        user: { id: 'userId', username: 'username'},
      };
      when(restRequestHelperMock.post<LoginParams, LoginResponse>(anything(), anything()))
        .thenReturn(of(loginResponse));

      // given
      const user = { username: 'testuser', password: '1111'};

      effects.showLoadingDistractor$.pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(action.type)
          .toBe('[Change loading state]');
        expect(action.loading)
          .toBeTruthy();
        done();
      });

      // when
      actions.next(login({ data: user }));
    });

    it('should hide the loading distractor when login call is done', (done) => {
      // given
      const loginResponse: UserState = {
        access_token: 'token',
        userInfo: { id: 'userId', username: 'username', password: 'anyPwd'},
      };

      effects.hideLoadingDistractor$.pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(action.type)
          .toBe('[Change loading state]');
        expect(action.loading)
          .toBeFalsy();
        done();
      });

      // when
      actions.next(loginSuccess({ response: loginResponse }));
    });

    it('should hide the loading distractor when login call fails', (done) => {
      effects.hideLoadingDistractor$.pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(action.type)
          .toBe('[Change loading state]');
        expect(action.loading)
          .toBeFalsy();
        done();
      });

      // given - when
      actions.next(loginFailure());
    });

  });

  describe('getCalls', () => {

    it('should get the initial calls (first page) when the login is successful', (done) => {
      const callResponse: CallsResponse = {
        totalCount: 10,
        hasNextPage: false,
        nodes: anything(),
      };

      when(restRequestHelperMock.get<CallsResponse>(anything()))
        .thenReturn(of(callResponse));

      // given
      const response = {
        access_token: 'token',
        userInfo: { id: 'userId', username: 'username', password: '1111' },
      };

      effects.retrieveInitialCalls$.pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(action.type)
          .toBe('[Retrieve calls success]');
        expect(action.response)
          .toEqual(callResponse);
        done();
      });

      // when
      actions.next(loginSuccess({ response }));
    });

    it('should request calls when retrieveCalls is dispatched', (done) => {
      const spy = jest.spyOn(TestBed.inject(RestRequestHelperService), 'get');

      // given
      const callResponse: CallsResponse = {
        totalCount: 10,
        hasNextPage: false,
        nodes: anything(),
      };

      when(restRequestHelperMock.get<CallsResponse>(anything()))
        .thenReturn(of(callResponse));

      effects.retrieveCalls$
        .pipe(take(1))
        .subscribe((action: any) => {
        // then
        expect(spy).toHaveBeenCalledWith(`${basePath}/${Routes.CALLS}?offset=10&limit=10`);
        expect(action.type)
          .toBe('[Retrieve calls success]');
        expect(action.response)
          .toEqual(callResponse);
        done();
      });

      // when
      actions.next(retrieveCalls({ limit: 10, offset: 10 }));
    });

    it('should throw and notify an error when request calls fails', (done) => {
      const spy = jest.spyOn(TestBed.inject(ErrorService), 'notifyError');

      // given
      const error = {
        status: 500,
        name: 'Unknown error',
        message: 'Error occurred on the server',
      };

      when(restRequestHelperMock.get<CallsResponse>(anything()))
        .thenThrow(error);

      effects.retrieveCalls$
        .pipe(take(1))
        .subscribe(() => {}, (err) => {
          // then
          expect(spy).toHaveBeenCalledWith(error);
          done();
        });

      // when
      actions.next(retrieveCalls({ limit: 10, offset: 10 }));
    });

  });

  describe('archiveCalls', () => {

    it('should archive/unarchive calls when archiveCall is dispatched', (done) => {
      const spy = jest.spyOn(TestBed.inject(RestRequestHelperService), 'put');

      when(restRequestHelperMock.put<ArchiveCallResponse>(anything()))
        .thenReturn(of({} as ArchiveCallResponse));

      effects.archiveCall$.subscribe((action: any) => {
        // then
        expect(spy).toHaveBeenCalledWith(`${basePath}/${Routes.CALLS}/:id/archive`);
        expect(action.type)
          .toBe('[Archive call success]');
        // response ignored since the changes are notified trough the pusher
        done();
      });

      // when
      actions.next(archiveCall({ callId: ':id' }));
    });

    it('should throw and notify an error when request archive call fails', (done) => {
      const spy = jest.spyOn(TestBed.inject(ErrorService), 'notifyError');

      // given
      const error = {
        status: 500,
        name: 'Unknown error',
        message: 'Error occurred on the server',
      };

      when(restRequestHelperMock.put<ArchiveCallResponse>(anything()))
        .thenThrow(error);

      effects.archiveCall$
        .subscribe(() => {}, (err) => {
          // then
          expect(spy).toHaveBeenCalledWith(error);
          done();
        });

      // when
      actions.next(archiveCall({ callId: 'anyId' }));
    });

  });

});

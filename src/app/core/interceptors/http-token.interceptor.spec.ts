import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { UrlSerializer } from '@angular/router';
import { HttpTokenInterceptor } from './http-token.interceptor';
import { RestRequestHelperService } from '../services/rest-request-helper.service';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../store/state';
import { of, ReplaySubject } from 'rxjs';
import { AppAction } from '../../store/actions';
import { Type } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { selectors } from '../../store/selectors';
import { first } from 'rxjs/operators';

describe('HttpTokenInterceptor', () => {
  const FAKE_URL = 'rest/fake-url';
  const actions = new ReplaySubject<AppAction>(1);

  let store: MockStore;
  let fakeRequest: () => TestRequest;
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let urlSerializer: UrlSerializer;

  const restRequestHelperMock = mock(RestRequestHelperService);

  beforeEach(() => {
    when(restRequestHelperMock.post(anything(), anything()))
      .thenReturn(of({ access_token: 'new-token'}));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        provideMockActions(actions.asObservable()),
        provideMockStore({ initialState }),
        { provide: RestRequestHelperService, useFactory: () => instance(restRequestHelperMock) },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpTokenInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
    urlSerializer = TestBed.inject(UrlSerializer);

    fakeRequest = (): TestRequest => {
      http.get(FAKE_URL).pipe(first()).subscribe();
      tick();

      return httpMock.expectOne(
        (req: HttpRequest<void>): boolean => req.url === FAKE_URL,
      );
    };
  });

  it('should append the token to the header Authorization field', fakeAsync(() => {
    // given
    const token = 'my-fresh-token';
    selectors.getToken.setResult(token);
    store.setState({
      user: {
        access_token: token,
        userInfo: { username: 'username', password: 'pwd', id: 'id' },
      },
    });

    // when
    const request = fakeRequest().request;

    // then
    expect(request.headers.get('Authorization'))
      .toBe(`Bearer ${token}`);
  }));

  it('should not append the token if undefined in the state', fakeAsync(() => {
    // given
    const token = undefined;
    selectors.getToken.setResult(token);
    store.setState({
      user: {
        access_token: token,
        userInfo: { username: 'username', password: 'pwd', id: 'id' },
      },
    });

    // when
    const request = fakeRequest().request;

    // then
    expect(request.headers.get('Authorization'))
      .toBeNull();
  }));

  it('should re-login and refresh the token when expired', fakeAsync(() => {
    // given
    const token = 'old-token';
    selectors.getToken.setResult(token);
    selectors.getUserInfo.setResult({ username: 'username', password: 'pwd', id: 'id' });

    store.setState({
      user: {
        access_token: token,
        userInfo: { username: 'username', password: 'pwd', id: 'id' },
      },
    });

    // when
    fakeRequest().error(new ErrorEvent('UNAUTHORIZED'), { status: 401 });

    // then
    verify(restRequestHelperMock.post(anything(), anything())).times(1);
  }));
});


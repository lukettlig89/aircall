import { AuthGuard } from './auth.guard';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { RestRequestHelperService } from '../services/rest-request-helper.service';
import { anything } from 'ts-mockito';
import { AppState } from '../../store/state';
import { first } from 'rxjs/operators';

describe('AuthGuard', () => {

  let guard: AuthGuard;
  let store: any;
  const restRequestServiceStub = {
    post: (a: any, b: any) => {},
    get: jest.fn(),
    put: jest.fn(),
  };

  beforeEach(() => {
    store = new Subject().asObservable() as Store<AppState>;
    guard = new AuthGuard(store, restRequestServiceStub as unknown as RestRequestHelperService);
  });


  it(('should not activate when username and password are undefined'), (done) => {
    store.select = (_: any) => of({ username: undefined, id: 'id', password: undefined });

    guard.canActivate(anything(), anything())
      .pipe(first())
      .subscribe((canActivate) => {
        expect(canActivate)
          .toBeFalsy();
        done();
      });
  });

  it(('should not activate when the user cannot be logged in'), (done) => {
    restRequestServiceStub.post = (path: any, body: any) =>
      of({ access_token: undefined });

    store.select = (_: any) => of({
      username: 'username', id: 'id', password: 'pwd',
    });

    guard.canActivate(anything(), anything())
      .pipe(first())
      .subscribe((canActivate) => {
        expect(canActivate)
          .toBeFalsy();
        done();
      });
  });

  it(('should activate when user can be logged'), (done) => {
    restRequestServiceStub.post = (path: any, body: any) =>
      of({ access_token: 'valid response'});

    store.select = (_: any) => of({
      username: 'username', id: 'id', password: 'pwd',
    });

    guard.canActivate(anything(), anything())
      .pipe(first())
      .subscribe((canActivate) => {
        expect(canActivate)
          .toBeTruthy();
        done();
      });
  });
});

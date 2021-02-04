import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { anything } from 'ts-mockito';
import { AppState } from '../../store/state';
import { first } from 'rxjs/operators';
import { RedirectGuard } from './redirect.guard';

describe('RedirectGuard', () => {

  let guard: RedirectGuard;
  let store: any;

  beforeEach(() => {
    store = new Subject().asObservable() as Store<AppState>;
    guard = new RedirectGuard(store);
  });


  it(('should not activate when username or password or token is defined'), (done) => {
    let callNumber = 0;
    store.select = (selector: any) => {
      callNumber++;

      return callNumber === 1 ? of({ username: 'username', id: 'id', password: undefined }) : of('token');
    };

    guard.canActivate(anything(), anything())
      .pipe(first())
      .subscribe((canActivate) => {
        expect(canActivate)
          .toBeFalsy();
        done();
      });
  });

  it(('should activate when username password and token are undefined'), (done) => {
    let callNumber = 0;
    store.select = (selector: any) => {
      callNumber++;

      return callNumber === 1 ? of({ username: undefined, id: undefined, password: undefined }) : of(undefined);
    };

    guard.canActivate(anything(), anything())
      .pipe(first())
      .subscribe((canActivate) => {
        expect(canActivate)
          .toBeTruthy();
        done();
      });
  });

});

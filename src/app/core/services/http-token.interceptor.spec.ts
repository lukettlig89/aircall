// import { TestBed } from '@angular/core/testing';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { HttpTokenInterceptor } from './http-token.interceptor';
// import { RestRequestHelperService } from './rest-request-helper.service';
// import { MockStore } from '@ngrx/store/testing';
// import { AppAction } from '../../store/actions';
// import { ReplaySubject, Subject } from 'rxjs';
// import { instance, mock } from 'ts-mockito';
// import { StoreModule } from '@ngrx/store';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { reducers } from '../../store/reducers';
//
// describe('GtfInterceptor', () => {
//   const FAKE_URL = 'rest/fake-url';
//   const actions: Subject<AppAction> = new ReplaySubject(1);
//   let store: MockStore;
//
//   beforeEach(() => {
//     jest.mock('./rest-request-helper.service', () => {
//       return {
//         RestRequestHelperService: jest.fn().mockImplementation(() => {
//           return {
//             get: () => {},
//             post: () => {},
//           };
//         })
//       };
//     });
//   });
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         BrowserDynamicTestingModule,
//       ],
//       providers: [
//         StoreModule.forRoot(reducers),
//         RestRequestHelperService,
//         {
//           provide: HTTP_INTERCEPTORS,
//           useClass: HttpTokenInterceptor,
//           multi: true,
//         }
//       ]
//     });
//     // effects = TestBed.inject(Effects);
//     store = TestBed.inject(MockStore);
//   });
//
//   it('should create', () => {
//     expect(true).toBe(true);
//   });
//
// });

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './store/reducers';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Effects } from './store/effects';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpTokenInterceptor } from './core/interceptors/http-token.interceptor';
import { CallsContainerModule } from './components/calls/calls-container.module';
import { ErrorSnackBarComponent } from './components/error-snack-bar/error-snack-bar.component';
import { CallDetailModule } from './components/call-detail/call-detail.module';

const devTools = [
  StoreDevtoolsModule.instrument({
    maxAge: 50,
  }),
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorSnackBarComponent,
  ],
  imports: [
    CallDetailModule,
    CallsContainerModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('aircall', reducers),
    EffectsModule.forRoot([ Effects ]),
    ...devTools,
  ],
  providers: [
    Effects,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

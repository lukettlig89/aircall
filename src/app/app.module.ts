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
import { CallsContainerComponent } from './components/calls/calls-container.component';
import { HttpTokenInterceptor } from './core/services/http-token.interceptor';
import { CallFiltersComponent } from './components/calls/call-filters/call-filters.component';
import { CallComponent } from './components/calls/call/call.component';
import { FormatDurationPipe } from './components/calls/format-date.pipe';

const devTools = [
  StoreDevtoolsModule.instrument({
    maxAge: 50,
  }),
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallsContainerComponent,
    CallFiltersComponent,
    CallComponent,
    FormatDurationPipe,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('aircall', reducers),
    EffectsModule.forRoot([Effects]),
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
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { FormatDurationPipe } from './format-date.pipe';
import { CallLegendComponent } from './call-legend/call-legend.component';
import { CallFiltersComponent } from './call-filters/call-filters.component';
import { CallComponent } from './call/call.component';
import { CallsContainerComponent } from './calls-container.component';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CallFiltersComponent,
    CallComponent,
    FormatDurationPipe,
    CallLegendComponent,
    CallsContainerComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CallsContainerComponent,
  ],
})
export class CallsContainerModule {
}

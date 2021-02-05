import { NgModule } from '@angular/core';
import { CallDetailContainerComponent } from './call-detail-container.component';
import { CallDetailComponent } from './call-detail/call-detail.component';
import { AppRoutingModule } from '../../app-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ CallDetailContainerComponent, CallDetailComponent ],
  imports: [ AppRoutingModule, CommonModule ],
  exports: [ CallDetailContainerComponent ],
})
export class CallDetailModule {
}

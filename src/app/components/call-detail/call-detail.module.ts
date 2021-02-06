import { NgModule } from '@angular/core';
import { CallDetailContainerComponent } from './call-detail-container.component';
import { CallDetailComponent } from './call-detail/call-detail.component';
import { AppRoutingModule } from '../../app-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { CallCellComponent } from './call-detail/call-cell/call-cell.component';
import { CallsContainerModule } from '../calls/calls-container.module';

@NgModule({
  declarations: [ CallDetailContainerComponent, CallDetailComponent, CallCellComponent ],
  imports: [ AppRoutingModule, CommonModule, MaterialModule, CallsContainerModule ],
  exports: [ CallDetailContainerComponent ],
})
export class CallDetailModule {
}

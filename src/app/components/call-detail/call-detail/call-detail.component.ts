import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Call, CallType, Direction, Note } from '../../../core/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'call-detail',
  templateUrl: './call-detail.component.html',
  styleUrls: ['./call-detail.component.scss']
})
export class CallDetailComponent {

  @Input() call?: Call | null;

  @Output() readonly archived = new EventEmitter<string>();

  archive(): void {
    this.archived.emit(this.call?.id);
  }

}

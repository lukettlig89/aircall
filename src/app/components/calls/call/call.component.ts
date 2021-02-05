import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Call, CallType, Direction } from '../../../core/models';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent {

  // @ts-ignore
  @Input() call: Call;
  @Output() readonly toggleArchive = new EventEmitter<void>();
  @Output() readonly viewCallDetails = new EventEmitter<void>();

  Direction = Direction;
  CallType = CallType;

  changeArchiveStatus(event: UIEvent): void {
    event.stopPropagation();
    this.toggleArchive.next();
  }

  openCall(): void {
    this.viewCallDetails.next();
  }
}

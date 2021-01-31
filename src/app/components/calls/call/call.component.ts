import { Component, Input } from '@angular/core';
import { Call, CallType, Direction } from '../../../core/models';


@Component({
  selector: 'call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent {

  // @ts-ignore
  @Input() call: Call;

  Direction = Direction;
  CallType = CallType;

}

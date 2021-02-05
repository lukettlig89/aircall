import { Component, Input } from '@angular/core';
import { Call } from '../../../core/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'call-detail',
  templateUrl: './call-detail.component.html',
  styleUrls: ['./call-detail.component.scss']
})
export class CallDetailComponent {

  @Input() call: Call | null = null;

}

import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'call-cell',
  templateUrl: './call-cell.component.html',
  styleUrls: [ './call-cell.component.scss' ]
})
export class CallCellComponent {

  @Input() title?: string;
  @Input() value?: string;

}

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filters } from '../call/filters';

@Component({
  selector: 'call-filters',
  templateUrl: './call-filters.component.html',
  styleUrls: ['./call-filters.component.scss']
})
export class CallFiltersComponent implements OnInit, OnDestroy {

  @Output() readonly filterChanged = new EventEmitter<Filters[]>();

  filtersForm = new FormGroup({
    archieved: new FormControl(true),
    notArchieved: new FormControl(true),
    missed: new FormControl(true),
    answered: new FormControl(true),
    voicemail: new FormControl(true),
    inbound: new FormControl(true),
    outbound: new FormControl(true),
  });

  destroy = new Subject();

  constructor() { }

  ngOnInit(): void {
    // @ts-ignore
    this.filtersForm.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((form) => {
        const filters: Filters[] = [];
        Object.keys(form).forEach((filter) => {
          if (form[filter]) {
            filters.push(filter as Filters);
          }
        });
        this.filterChanged.emit(filters);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '../../core/services/error.service';
import { filter } from 'rxjs/operators';

const defaultErrorMessage = 'Ops, something went wrong. Please retry.';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-snack-bar',
  templateUrl: './error-snack-bar.component.html',
  styleUrls: ['./error-snack-bar.component.scss']
})
export class ErrorSnackBarComponent implements OnInit{

  constructor(
    private snackBar: MatSnackBar,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.errorService.error$
      .pipe(
        filter((err) => err !== undefined),
      )
      .subscribe((error) => {
        this.openSnackBar((error as Error).message ?? defaultErrorMessage);
      });
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Error', {
      duration: 5000,
    });
  }

}


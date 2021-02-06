import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Call, CallResponse } from '../../core/models';
import { RestRequestHelperService } from '../../core/services/rest-request-helper.service';
import { basePath, Routes } from '../../core/configs/routes';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from '../../core/services/error.service';
import { StoreFacade } from '../../store/store.facade';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'call-detail-container',
  templateUrl: './call-detail-container.component.html',
})
export class CallDetailContainerComponent implements OnInit {

  call$?: Observable<Call>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly restRequestHelper: RestRequestHelperService,
    private readonly errorService: ErrorService,
    private readonly facade: StoreFacade,
  ) { }

  ngOnInit(): void {
    const callId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (callId !== undefined) {
      this.call$ = this.restRequestHelper.get<CallResponse>(`${basePath}/${Routes.CALLS}/${callId}`)
        .pipe(
          map((res) => res),
          catchError((err) => {
            this.errorService.notifyError(err);

            return EMPTY;
          }),
        );
    }
  }

  archive(callId: string): void {
    this.facade.changeArchiveStatus(callId);
  }

}

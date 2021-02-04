import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class ErrorService {
  private readonly errorSubject = new BehaviorSubject<Error | undefined>(undefined);

  constructor() {
  }

  get error$(): Observable<Error | undefined> {
    return this.errorSubject.asObservable();
  }

  notifyError(error: Error): void {
    this.errorSubject.next(error);
  }
}

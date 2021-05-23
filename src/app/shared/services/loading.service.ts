import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject$ = new Subject();

  constructor() {}

  shouldLoad(): Observable<boolean> {
    return this.loadingSubject$ as Observable<boolean>;
  }

  startLoading() {
    this.loadingSubject$.next(true);
  }

  stopLoading() {
    this.loadingSubject$.next(false);
  }
}

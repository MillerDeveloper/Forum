import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification, NotificationType } from '../../interfaces/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _subject = new Subject<any>()
  private _idx = 0

  constructor() { }

  getObservable(): Observable<any> {
    return this._subject.asObservable()
  }

  error(title: string, message: string, timeout = 0) {
    this._subject.next(new Notification(this._idx++, NotificationType.error, title, message, timeout));
  }
}

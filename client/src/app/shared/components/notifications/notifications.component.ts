import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../interfaces/Notification';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notifications: any[] = []
  private _subscription: Subscription

  constructor(private _notificationSvc: NotificationService) { }
 
  ngOnInit(): void {
    this._subscription = this._notificationSvc.getObservable().subscribe((notification: any) => {
      this._addNotification(notification)
    })
  }

  private _addNotification(notification: any) {
    this.notifications.push(notification)

    if (notification.timeout !== 0) {
      setTimeout(() => this.close(notification), notification.timeout);
    }
  }

  close(notification: any) {
    this.notifications = this.notifications.filter(notif => notif.id !== notification.id);
  }
 
  className(notification: any): string {

    let style: string;

    switch (notification.type) {

      case NotificationType.success:
        style = 'success';
        break;

      case NotificationType.warning:
        style = 'warning';
        break;

      case NotificationType.error:
        style = 'error';
        break;

      default:
        style = 'info';
        break;
    }

    return style;
  }

  ngOnDestroy() {
    if(this._subscription) this._subscription.unsubscribe()
  }
}

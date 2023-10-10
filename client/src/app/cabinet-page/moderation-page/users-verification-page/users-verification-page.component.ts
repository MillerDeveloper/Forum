import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/User';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-users-verification-page',
  templateUrl: './users-verification-page.component.html',
  styleUrls: ['./users-verification-page.component.scss']
})
export class UsersVerificationPageComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService) { }
  subscriptions: Subscription = new Subscription()
  users: User[] = []

  ngOnInit(): void {
    this.subscriptions.add(this.userService.getNotModerated().subscribe(
      (users: User[]) => {
        this.users = users
      },
      (error) => {}
    ))
  }

  allowUser(user: User) {
    this.subscriptions.add(this.userService.allowUser(user).subscribe(
      (result) => {},
      (error) => {}
    ))
  }

  disAllowUser(user: User) {
    this.subscriptions.add(this.userService.disAllowUser(user).subscribe(
      (result) => {},
      (error) => {}
    ))
  }

  ngOnDestroy() {
    if(this.subscriptions) this.subscriptions.unsubscribe()
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) { }

  loginFormGroup: FormGroup
  loginSubscription: Subscription

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  login() {
    this.authService.login(this.loginFormGroup.value)
    .pipe(tap(result => {
      if(result) {
        localStorage.setItem('token', JSON.stringify(result))
        document.cookie = `token=${result}`
      }
    }))
    .subscribe(
      () => {
        this.router.navigate(['/cabinet/personal-companies'])
      },
      (error) => this.notificationService.error('Ошибка авторизации', error.error, 5000)
    )
  }


  ngOnDestroy() {
    if(this.loginSubscription) this.loginSubscription.unsubscribe()
  }
}

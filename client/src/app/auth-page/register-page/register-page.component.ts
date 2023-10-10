import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private router: Router, 
    private notificationService: NotificationService
  ) { }

  registerFormGroup: FormGroup
  registerSubscription: Subscription

  ngOnInit(): void {
    this.registerFormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      repeatedPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  register() {
    this.registerFormGroup.disable()
    this.registerSubscription = this.authService.register(this.registerFormGroup.value).subscribe(
      (result) => {
        if(result._id) {
          this.router.navigate(['/auth/login'])
        }
      },
      (error) => {
        this.notificationService.error('Ошибка регистрации', error.error, 5000)
      },
      () => {
        this.registerFormGroup.enable()
      }
    )
  }


  ngOnDestroy() {
    if(this.registerSubscription) this.registerSubscription.unsubscribe()
  }
}

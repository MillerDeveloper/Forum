import { UserService } from './../../shared/services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CabinetService } from 'src/app/shared/services/cabinet/cabinet.service';
import { User } from 'src/app/shared/interfaces/User';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import * as imageConversion from 'image-conversion'

@Component({
  selector: 'app-personal-data-page',
  templateUrl: './personal-data-page.component.html',
  styleUrls: ['./personal-data-page.component.scss']
})
export class PersonalDataPageComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private cabinetService: CabinetService, private router: Router, private notificationService: NotificationService) { }

  contactFormGroup: FormGroup
  passwordFormGroup: FormGroup
  currentUser: User
  
  changePassword: boolean = false
  loading: boolean = false

  subscriptions: Subscription = new Subscription()

  ngOnInit(): void {
    this.loading = true
    this.contactFormGroup = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      idUser: new FormControl(null)
      // phone: new FormControl(null),
      // city: new FormControl(null)
    })

    this.passwordFormGroup = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      repeatedPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)])
    })

    this.subscriptions.add(this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user 

        this.contactFormGroup.patchValue({
          name: this.currentUser.name,
          email: this.currentUser.email,
          idUser: this.currentUser._id
          // phone: this.currentUser.phone, 
          // city: this.currentUser.city
        })

        this.loading = false 
      },
      (error) => {
        this.router.navigate(['/auth/login'])
      }
    ))
  }

  save() {
    this.subscriptions.add(this.cabinetService.updateUserData(this.contactFormGroup.value).subscribe(
      () => {},
      (error) => {
        this.notificationService.error('Ошибка валидации данных', error.error, 5000)
        // this.router.navigate(['/auth/login'])
        
      }
    ))

    if(this.changePassword) {
      this.subscriptions.add(this.cabinetService.updateUserPassword(this.passwordFormGroup.value).subscribe(
        (result) => {
          this.changePassword = false
        },
        (error) => { 
          this.notificationService.error('Ошибка валидации данных', error.error, 5000)
          // this.router.navigate(['/auth/login'])
        }
      ))
    }
  }

  uploadImage(event) {
    const files = event.target.files     
    if(files) {
      imageConversion.compress(files[0], 0.2).then(res => {
        const formData = new FormData()
        formData.append('avatar', res, files[0].name) 

        this.subscriptions.add(this.userService.updateAvatar(formData, this.currentUser._id).subscribe(
          () => {}
        )) 
      })
    }
  }

  ngOnDestroy(): void {
    if(this.subscriptions) this.subscriptions.unsubscribe()
  }
}

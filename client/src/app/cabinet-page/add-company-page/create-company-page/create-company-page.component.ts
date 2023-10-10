import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/shared/interfaces/Company';
import { User } from 'src/app/shared/interfaces/User';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-create-company-page',
  templateUrl: './create-company-page.component.html',
  styleUrls: ['./create-company-page.component.scss']
})
export class CreateCompanyPageComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService, 
    private companyService: CompanyService,
    private router: Router, 
    private notificationService: NotificationService
  ) { }

  subscriptions: Subscription = new Subscription()

  currentUser: User
  currentCompany: Company

  companyFormGroup: FormGroup
  addressFormGroup: FormGroup

  createSub: Subscription

  addresses = []
  phones = []
  tags = []

  ngOnInit(): void {
    this.subscriptions.add(this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user
      },
      (error) => {}
    ))

    this.companyFormGroup = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null),
      site: new FormControl(null),
      director: new FormControl(null), 
      tags: new FormControl(null),
      specialization: new FormControl(null),
      yearOfFoundation: new FormControl(null),
      licenseNo: new FormControl(null),
      email: new FormControl(null, [Validators.email]),
      address: new FormControl([]),
      phones: new FormControl(null),
    })

    this.addressFormGroup = new FormGroup({
      city: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required])
    })
  }

  addTag() {
    this.tags.push({name: this.companyFormGroup.value.tags})
    this.companyFormGroup.patchValue({
      tags: null
    })
  }

  deleteTag(chip) {    
    const index = this.tags.findIndex(tag => tag.name === chip.name)
    if(index !== -1) {
      this.tags.splice(index, 1)
    }
  }

  addPhone() {    
    console.log(this.companyFormGroup.value.phones);
    
    this.phones.push({phone: this.companyFormGroup.value.phones})
    this.companyFormGroup.patchValue({
      phones: null
    })
  }

  deletePhone(chip) {
    const index = this.phones.findIndex(phone => phone.phone === chip.name)
    this.phones.splice(index, 1)
  }

  addAddress() {
    console.log(this.addressFormGroup.value);
    const countryExists = this.addresses.findIndex(address => address.country === this.addressFormGroup.value.country)
    if(countryExists !== -1) {
      const cityExists = this.addresses[countryExists].cities.findIndex(item => item.city === this.addressFormGroup.value.city)
      if(cityExists !== -1) {
        this.addresses[countryExists].cities[cityExists].addresses.push(this.addressFormGroup.value.address)
      } else {
        this.addresses[countryExists].cities.push({
          city: this.addressFormGroup.value.city,
          addresses: [this.addressFormGroup.value.address]
        })
      }
    } else {
      this.addresses.push({
        country: this.addressFormGroup.value.country,
        cities: [{
          city: this.addressFormGroup.value.city,
          addresses: [this.addressFormGroup.value.address]
        }]
      })
    }  

    this.addressFormGroup.reset()
  }

  deleteAddress(chip) {
    console.log(chip);
    
    this.addresses.forEach((address, addressIndex) => {
      address.cities.forEach((city, cityIndex) => {
        const index = city.addresses.findIndex((addr) => addr === chip.name)
        if(index !== -1) {
          if(this.addresses[addressIndex].cities[cityIndex].addresses.length > 1) {
            this.addresses[addressIndex].cities[cityIndex].addresses.splice(index, 1)

            return
          } else if(this.addresses[addressIndex].cities[cityIndex].addresses.length === 1) {
            this.addresses[addressIndex].cities.splice(cityIndex, 1)
            if(this.addresses[addressIndex].cities.length === 0) {
              this.addresses.splice(addressIndex, 1)

              return
            }
          }
        }
      })
    })
  }

  create(companyData) {
    this.subscriptions.add(this.companyService.createCompany(companyData.formData).subscribe(
      async (result) => {
        if(companyData.files.has('avatar')) {
          await this.companyService.updateAvatar(companyData.files, result._id).toPromise()
        }

        this.router.navigate(['/cabinet/personal-companies']) 
      },
      (error) => {this.notificationService.error('Ошибка валидации данных', error.error, 5000)}
    ))
  }

  ngOnDestroy() {
    if(this.subscriptions) this.subscriptions.unsubscribe()
  }
}

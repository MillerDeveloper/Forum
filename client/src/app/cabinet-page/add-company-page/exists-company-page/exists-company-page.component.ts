import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/shared/interfaces/Company';
import { User } from 'src/app/shared/interfaces/User';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-exists-company-page',
  templateUrl: './exists-company-page.component.html',
  styleUrls: ['./exists-company-page.component.scss']
})
export class ExistsCompanyPageComponent implements OnInit, OnDestroy {

  constructor(private searchService: SearchService, private companyService: CompanyService, private userService: UserService, private notificationService: NotificationService) { }

  searchedCompanies: Company[] = []
  selectedCompany: Company

  searchTimeout: any

  searchSubscription: Subscription
  companyRequestSubscription: Subscription
  currentUser: User
  confirmFormGroup: FormGroup

  ngOnInit(): void { 
    this.userService.getCurrentUser()
  } 


  search(event) {
    if(event.target.value.length >= 3) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.searchSubscription = this.searchService.searchCompanies(event.target.value).subscribe(result => {
          this.searchedCompanies = result
        })
      }, 200) 
    }

    this.confirmFormGroup = new FormGroup({
      fio: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email])
    })
  }

  selectCompany(company: Company) {
    this.selectedCompany = company
  }

  send() {
    this.confirmFormGroup.disable()
    this.companyRequestSubscription = this.companyService.companyRequest(Object.assign({}, this.selectedCompany, this.confirmFormGroup.value)).subscribe(
      (response) => {
        this.confirmFormGroup.enable()
        this.confirmFormGroup.reset()
        this.selectedCompany = null
      },
      (error) => {
        this.notificationService.error('Ошибка валидации данных', error.error, 5000)
        this.confirmFormGroup.enable()
      }
    )
  }

  ngOnDestroy(): void {
    if(this.searchSubscription) this.searchSubscription.unsubscribe()
    if(this.companyRequestSubscription) this.companyRequestSubscription.unsubscribe()
  }
}

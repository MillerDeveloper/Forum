import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/shared/interfaces/Company';
import { User } from 'src/app/shared/interfaces/User';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-personal-companies-page',
  templateUrl: './personal-companies-page.component.html',
  styleUrls: ['./personal-companies-page.component.scss']
})
export class PersonalCompaniesPageComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private router: Router, private companyService: CompanyService) { }

  companies: Company[] = []
  currentUser: User = null
  subscriptions: Subscription = new Subscription()
  loading: boolean = false

  ngOnInit(): void {
    this.loading = true

    this.subscriptions.add(this.userService.getCurrentUser().subscribe(
      (user) => {
        this.currentUser = user
      }, 
      (error) => {}
    ))
    
    this.subscriptions.add(this.userService.getCurrentUserCompanies().subscribe(
      (companies: Company[]) => {
        this.companies = companies
        this.loading = false
      },
      (error) => {
        this.userService.clearUserData()
        this.router.navigate(['/auth/login'])
      }
    ))
  }

  delete(event) {
    const index = this.companies.findIndex(company => company._id === event._id)
    
    if(index !== -1) {
      this.subscriptions.add(this.companyService.delete(event).subscribe(
        () => {
          this.companies.splice(index, 1)
        },
        (error) => {}
      ))
    } else {
      console.log(index)
    }
  }

  ngOnDestroy() {
    if(this.subscriptions) this.subscriptions.unsubscribe()
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { Company } from '../../interfaces/Company';
import { User } from '../../interfaces/User';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { SearchService } from '../../services/search/search.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isHomePage = false

  constructor(private searchService: SearchService, private userService: UserService, private router: Router, private analyticsService: AnalyticsService) { }

  subscription: Subscription = new Subscription()

  searchTimeout: any
  searchedCompanies: Company[] = []
  currentUser: User = null
  loading: boolean = false
  viewMenu: boolean = window.innerWidth > 768 ? true : false 

  visitors = {
    today: 0,
    total: 0
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')) {
      this.currentUser = {
        name: JSON.parse(localStorage.getItem('lastUserName')) || '',
        email: ''
      }

      this.loading = true
      this.subscription.add(this.userService.getCurrentUser().subscribe(
        (user: User) => {
          if(user) {
            this.currentUser = user   
            this.userService.setUser(user)
            localStorage.setItem('lastUserName', JSON.stringify(this.currentUser.name))      
          }
        },
        (error) => {
          console.log(error.error)
        }, 
        () => this.loading = false
      ))
    } else {
      localStorage.removeItem('lastUserName')
    }

    if(this.isHomePage) {
      this.analyticsService.updateCountVisitors().toPromise()

      this.subscription.add(this.analyticsService.getAllAnalytics().subscribe(
        (analytics) => {
          this.visitors.today = analytics[0].visitors || 0
          analytics.forEach((value) => {
            this.visitors.total += value.visitors || 0
          })        
        },
        (error) => console.log(error)
      ))
    }
  }

  search(event) {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.subscription.add(this.searchService.searchCompanies(event.target.value).subscribe(
        (result) => {          
          this.searchedCompanies = result
        },
        (error) => {console.log(error)}
      ))
    }, 200)
  }

  logOut() {
    this.currentUser = null
    localStorage.removeItem('token')
    localStorage.removeItem('lastUserName')
    this.router.navigate(['/auth/login'])
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
    if(this.searchTimeout) clearTimeout(this.searchTimeout) 
  }
}

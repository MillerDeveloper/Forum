import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/shared/interfaces/Company';
import { Comment } from 'src/app/shared/interfaces/Comment';
import { User } from 'src/app/shared/interfaces/User';
import { CommentService } from 'src/app/shared/services/comment/comment.service';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-personal-company-data-page',
  templateUrl: './personal-company-data-page.component.html',
  styleUrls: ['./personal-company-data-page.component.scss']
})
export class PersonalCompanyDataPageComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private companyService: CompanyService, 
    private route: ActivatedRoute, 
    private router: Router,
    private commentService: CommentService
  ) { }

  currentUser: User 
  currentCompany: Company
  comments: Comment[] = []

  idCompany: string
  loading: boolean = false

  subscriptions: Subscription = new Subscription()

  ngOnInit(): void {
    this.subscriptions.add(this.route.params.subscribe(
      (params: Params) => {
        this.idCompany = params['id']
        this.getCompany()
        this.getUser()
      }
    ))

    this.getComments() 
  }

  getComments() {
    this.comments = [] 
    this.subscriptions.add(this.commentService.getComments(this.idCompany).subscribe(
      (comments: Comment[]) => {
        this.comments = comments
        this.loading = false
      },
      (error) => {
        this.userService.clearUserData()
        this.router.navigate(['/auth/login'])
      }
    ))
  }

  getCompany() {
    this.subscriptions.add(this.companyService.getCompany(this.idCompany).subscribe(
      (company: Company) => {
        this.currentCompany = company
      }, 
      (error) => {}
    ))
  }

  getUser() {
    this.subscriptions.add(this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user
      },
      (error) => {}
    ))
  }

  update(companyData) {    
    this.subscriptions.add(this.companyService.update(companyData.formData, this.idCompany).subscribe(
      async () => {        
        if(companyData.files.has('avatar')) {          
          await this.companyService.updateAvatar(companyData.files, this.idCompany).toPromise()
        }

        this.router.navigate(['/cabinet/personal-companies'])
      },
      (error) => {}
    ))
  }

  ngOnDestroy() {
    if(this.subscriptions) this.subscriptions.unsubscribe()
  }
}

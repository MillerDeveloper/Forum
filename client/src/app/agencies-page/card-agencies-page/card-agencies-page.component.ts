import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/shared/interfaces/Company';
import { Comment } from 'src/app/shared/interfaces/Comment';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { CommentService } from 'src/app/shared/services/comment/comment.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { User } from 'src/app/shared/interfaces/User';
import { Meta, Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';

@Component({
  selector: 'app-card-agencies-page',
  templateUrl: './card-agencies-page.component.html',
  styleUrls: ['./card-agencies-page.component.scss']
})
export class CardAgenciesPageComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('commentsFormSection') commentsFormSection: ElementRef 
  @ViewChild('commentsSection') commentsSection: ElementRef 

  constructor(
    private companyService: CompanyService, 
    private commentService: CommentService,
    private notificationService: NotificationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private seoService: SeoService
  ) { }

  idCompany: string = null
  appealComment: Comment = null

  company: Company
  comments: Comment[] = []
  positiveComments: Comment[] = []
  negativeComments: Comment[] = []

  countComments: number = 0
  trustBoxPositiveWidth: number = 0
  trustBoxNegativeWidth: number = 0

  trustBoxLoaded: boolean = false

  rootComment: Comment
  replyForComment: Comment = null
  currentUser: User = null

  commentsParams: Params = {
    limit: 5, 
    skip: 0  
  }

  subscription: Subscription = new Subscription()
  commentsControl: FormGroup

  ngOnInit() {    
    this.subscription.add(this.route.params.subscribe(
      (params: Params) => {
        this.idCompany = params['id']
        this.countMoodComments()
        this.getComments()
        this.getCompany()
        this.currentUser = this.userService.getUser()     
      }
    ))

    if(!this.currentUser && localStorage.getItem('token')) {
        this.subscription.add(this.userService.getCurrentUser().subscribe(
          (user: User) => this.currentUser = user,
          (error) => {}
        ))
    }

    this.subscription.add(this.commentService.commentReply.subscribe((response) => {
      if (response?.comment) {
        this.reply(response.comment, response.rootComment)
      }
    }))

    this.commentsControl = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      text: new FormControl(null, [Validators.required, Validators.maxLength(5000)]),
      pickedRating: new FormControl(null),
      idCompany: new FormControl(this.idCompany, Validators.required), 
      replyFor: new FormControl(null),
      replyForName: new FormControl(null),
      rootComment: new FormControl(null),
      dateComment: new FormControl(null),
      idUser: new FormControl(null),
      city: new FormControl(null)
    })

    this.seoService.updateCanonical()
  }

  ngAfterViewInit() {
    
  }

  getCompany() {    
    this.subscription.add(this.companyService.getCompany(this.idCompany).subscribe(
      (company: Company) => {
        if(company) {
          this.company = company

          this.title.setTitle(`${company?.name} - отзывы клиентов о агенстве. Отзывы реальных людей`) 

          this.meta.updateTag(
            {name: 'title', content: `${company?.name} - отзывы клиентов о агенстве. Отзывы реальных людей`}
          ) 

          this.meta.updateTag(  
            {name: 'keywords', content: `${company?.name} отзывы клиентов. Рейтинг компании ${company?.name}`},
          ) 
 
          this.meta.updateTag(
            {name: 'description', content: `Отзывы о компании ${company?.name}. Честные отзывы реальных людей, рейтинг надёжности компании ${company?.name}. Портал Zarobitchany za kordonom`}     
          )  

          this.companyService.updateVisitors(company).toPromise()
        }
      },
      (error) => {
        console.log(error)
      }
    ))
  }

  getComments() {
    this.subscription.add(this.commentService.getComments(this.idCompany, this.commentsParams).subscribe((comments: any) => {
      this.comments = comments         
    }))
  }

  countMoodComments() {
    this.subscription.add(this.commentService.countMoodComments(this.idCompany).subscribe(
      (result) => {        
        this.positiveComments = result.positiveComments
        this.negativeComments = result.negativeComments
        this.countComments = result.count      
        
        this.trustBoxPositiveWidth = this.toFixedValue((result.positiveComments.length * 100) / result.count)
        this.trustBoxNegativeWidth = this.toFixedValue((result.negativeComments.length * 100) / result.count)
      }
    ))
  }

  getFloorValue(number: number): number {
    return Math.floor(number) 
  }

  toFixedValue(number: number): number {
    return +number.toFixed(1)
  }

  submitComment() {
    if(this.commentsControl.value.pickedRating || this.replyForComment) {
      this.commentsControl.patchValue({
        idCompany: this.idCompany,
        idUser: this.currentUser?._id || null
      })

      this.commentsControl.disable()
      this.subscription.add(this.commentService.addComment(this.commentsControl.value).subscribe(
        (comment: any) => {
          if(this.replyForComment === null) {
            this.comments.unshift(comment)
          } else {
            this.getComments()
            this.replyForComment = null
          }

          this.commentsControl.enable()
        },
        (error: any) => {
          console.log(error)
          this.commentsControl.enable()
        },
        () => {
          this.commentsControl.patchValue({
            name: null, 
            text: null, 
            replyFor: null,
            dateComment: null,
            city: null
          })
        }
      ))
    } else {      
      this.notificationService.error('Ошибка отправки комментария', 'Выберите рейтинг!', 3500)
    }
  }

  reply(comment: Comment, rootComment: Comment) {  
    this.replyForComment = comment 

    this.commentsControl?.patchValue({
      replyForName: rootComment.nameUser,
      idUser: this.currentUser?._id || null, 
      replyFor: comment._id
    })

    if(rootComment) {
      this.commentsControl?.patchValue({
        rootComment: rootComment,
      })
    }

    this.commentsFormSection?.nativeElement?.scrollIntoView({
      behavior: "smooth", 
      block: "start", 
      inline: "nearest"
    })
  }

  appeal(comment: Comment) {
    this.appealComment = comment
  }

  changePage(event) {
    if(event.index === 1) {
      this.commentsParams.skip = 0
    } else {
      this.commentsParams.skip = (event.index * 5) - 5
    }

    this.getComments()    
  }

  scrollToTop() {
    this.commentsSection?.nativeElement?.scrollIntoView({
      behavior: "smooth", 
      block: "start", 
      inline: "nearest"
    })
  }

  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe()    
  }
}

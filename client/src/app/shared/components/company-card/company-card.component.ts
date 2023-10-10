import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from '../../interfaces/Company';
import { Comment } from '../../interfaces/Comment';
import { CommentService } from '../../services/comment/comment.service';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit, OnDestroy {
  @Input() company: Company
  @Input() canDelete: boolean = false
  @Input() showButtons: boolean = false
  @Input() link: string = '/cabinet/personal-companies/'
  @Input() cardView: boolean = false
  @Output() delete = new EventEmitter()

  constructor(private commentService: CommentService) { }

  positiveComments: Comment[] = [] 
  negativeComments: Comment[] = []
  countComments: number = 0

  subscription: Subscription = new Subscription()

  ngOnInit() {
    if(this.cardView) {
      this.subscription.add(this.commentService.countMoodComments(this.company._id).subscribe(
        (result) => {        
          this.positiveComments = result.positiveComments
          this.negativeComments = result.negativeComments         
        },
        (error) => {}
      ))
    } else {
      this.subscription.add(this.commentService.countComments(this.company._id).subscribe(
        (count: number) => this.countComments = count,
        (error) => {}
      ))
    }
  } 

  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe()
  }
}

import { Comment } from './../../../shared/interfaces/Comment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommentService } from 'src/app/shared/services/comment/comment.service';
import { User } from 'src/app/shared/interfaces/User';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments-verification-page',
  templateUrl: './comments-verification-page.component.html',
  styleUrls: ['./comments-verification-page.component.scss']
})
export class CommentsVerificationPageComponent implements OnInit, OnDestroy {

  constructor(
    private commentService: CommentService,
    private userService: UserService
  ) { }

  notVerified: Comment[] = []
  currentUser: User
  subscriptions: Subscription = new Subscription()

  ngOnInit(): void {
    this.subscriptions.add(this.commentService.getNotVerifiedComments().subscribe(
      (comments: any) => {
        this.notVerified = comments
      }
    ))

    this.subscriptions.add(this.userService.getCurrentUser().subscribe(
      (user) => this.currentUser = user
    ))
  }

  // allowComment(comment: Comment, index, event) {
  //   event.stopPropagation()
  //   event.preventDefault()
  //   this.subscriptions.add(this.commentService.allowComment(comment).subscribe(
  //     () => {
  //       this.notVerified.splice(index, 1)
  //     },
  //     (error: any) => {}
  //   ))
  // }
  
  ngOnDestroy() {
    if(this.subscriptions) {
      this.subscriptions.unsubscribe()
    }
  }
}

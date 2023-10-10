import { CommentService } from 'src/app/shared/services/comment/comment.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Comment } from '../../interfaces/Comment'
import { User } from '../../interfaces/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-tree',
  templateUrl: './comment-tree.component.html',
  styleUrls: ['./comment-tree.component.scss'] 
})
export class CommentTreeComponent implements OnInit, OnDestroy {
  @Input() comments: Comment[] = []
  @Input() rootComment: Comment = null
  @Input() edit: boolean = false
  @Input() user: User = null
  @Input() isReply: boolean = false 
  @Input() canDelete: boolean = false 
  @Input() config: any

  @Output() pickRating = new EventEmitter() 
  @Output() appeal = new EventEmitter()

  subscriptions: Subscription = new Subscription()

  constructor(private commentService: CommentService) { }

  ngOnInit(): void { }

  replyTo(comment, rootComment = null) {    
    this.commentService.reply(comment, this.rootComment ? this.rootComment : rootComment)  
  }

  saveComment(comment, rootComment) {
    this.subscriptions.add(this.commentService.updateComment(comment, rootComment).subscribe(
      (result) => {},
      (error) => {}
    ))
  }

  hide(comment, rootComment) {
    this.subscriptions.add(this.commentService.hideComment(comment, rootComment).subscribe(
      (result) => {},
      (error) => {}
    ))
  }

  deleteComment(comment, rootComment) {
    this.subscriptions.add(this.commentService.disAllowComment(comment, rootComment).subscribe(
      (result) => {},
      (error) => {}
    )) 
  }

  allowComment(rootComment: Comment, comment,  index, event) {
    event.stopPropagation()
    event.preventDefault()
    this.subscriptions.add(this.commentService.allowComment(rootComment, comment).subscribe(
      () => {
        this.comments.splice(index, 1)
      },
      (error: any) => {}
    ))
  }

  ngOnDestroy() {
    if(this.subscriptions) {
      this.subscriptions.unsubscribe()
    }
  }
}

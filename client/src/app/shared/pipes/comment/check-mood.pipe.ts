import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../../interfaces/Comment'
import { CommentService } from '../../services/comment/comment.service';

@Pipe({
  name: 'checkMood'
})
export class CheckMoodPipe implements PipeTransform, OnDestroy {

  filteredComments: Comment[] = []

  constructor(private commentService: CommentService) {}

  async transform(commnt: Comment[], mood: string, idCompany: string) {   
    const comments = await this.commentService.getComments(idCompany).toPromise()
    
    comments.forEach(comment => {
      if(mood === 'positive' && comment.pickedRating >= 4 && !comment.hidden) {
        this.filteredComments.push(comment)        
      } else if(mood === 'negative' && comment.pickedRating < 4 &&  !comment.hidden) {
        this.filteredComments.push(comment)
      } 

      if(comment.replies?.length > 0) {
        this.filterComment(comment.replies, mood)
      }
    })

    return this.filteredComments.length    
  }

  filterComment(comments, mood) {
    comments.forEach(comment => {
      if(mood === 'positive' && comment.pickedRating >= 4 && !comment.hidden) {
        this.filteredComments.push(comment)        
      } else if(mood === 'negative' && !comment.hidden) {
        this.filteredComments.push(comment)
      }

      if(comment.replies.length > 0) {
        this.filterComment(comments, mood)
      }
    })
  }

  ngOnDestroy() {
    if(this.filteredComments) this.filteredComments = []
  }
}

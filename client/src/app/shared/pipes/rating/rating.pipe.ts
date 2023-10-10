import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../../interfaces/Comment';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {
  allCommentsLength = 0

  transform(companies: Comment[], rating: number): number {
    if(companies.length > 0) {
      companies.forEach(company => {
        this.returnCommentsLength(company)
      })
    }

    console.log(rating / (this.allCommentsLength || 1));
    
    
    return (rating / (this.allCommentsLength || 1))
  }

  returnCommentsLength(comment: Comment[] | Comment): number {
    if(Array.isArray(comment)) {
      comment.forEach(comment => {
        this.allCommentsLength += comment.replies?.length
        this.returnCommentsLength(comment)
      })
    } else {
      if(comment.replies?.length > 0) {
        this.allCommentsLength += comment.replies?.length
        this.returnCommentsLength(comment.replies)
      } else {
        return
      }
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '.././../interfaces/Comment'

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() pickedRating: number = null
  @Input() pick: boolean = false
  // @Input() calculate: any = null
  @Output() picked = new EventEmitter()
  constructor() { }

  pickedRaiting: number = null
  isPicked: boolean = false
  rating: string[] = []
  pickedTimeOut: any

  allCommentsLength = 0

  emptyRating: string[] = [
    'star-border star-pick', 
    'star-border star-pick', 
    'star-border star-pick', 
    'star-border star-pick', 
    'star-border star-pick'
  ]
  

  ngOnInit(): void {             
    // if(this.calculate) {
    //   if(this.calculate.comments.length > 0) {
    //     this.calculate.comments.forEach(company => {
    //       this.returnCommentsLength(company)
    //     })

    //     this.pickedRating = this.calculate.company.rating / (this.allCommentsLength || 1)
    //   }

    //   this.setRating()
    // } else {
      if(this.pick && !this.pickRating) {
        this.rating = this.emptyRating
      } else if(this.pick && this.pickRating) {
        this.setRating()
      } else {
        this.setRating()
      }
    // }
  }

  returnCommentsLength(comment: Comment) {
    this.allCommentsLength += 1    
    if(comment.replies?.length > 0) {
      comment.replies.forEach(comment => {
        this.returnCommentsLength(comment)
      })
    }
  }

  setRating() {            
    const fractionPart = this.pickedRating - Math.floor(this.pickedRating)
        
    for(let i = 0; i < Math.floor(this.pickedRating); i++) {
      this.rating.push('star')
    }

    if(this.pickedRating > Math.floor(this.pickedRating)) {
      if(fractionPart - 0.75 >= 0) {
        this.rating.push('star-75')
      } else if(fractionPart - 0.50 >= 0) {
        this.rating.push('star-50')
      } else if(fractionPart - 0.25 >= 0) {
        this.rating.push('star-25')
      }
    }      

    for(let i = this.rating.length; i < 5; i++) {
      this.rating.push('star-border')
    }    
  }

  pickRating(index: number, picked: boolean = false, isMouseLeave: boolean = false) {
    if(picked) {
      this.isPicked = true
      this.picked.emit(index)
      this.pickedRaiting = index
    }

    if(this.isPicked && picked === false) {
      return
    }

    if(isMouseLeave) {
      clearTimeout(this.pickedTimeOut)
      this.pickedTimeOut = setTimeout(() => {
        this.rating = [
          'star-border star-pick', 
          'star-border star-pick', 
          'star-border star-pick', 
          'star-border star-pick', 
          'star-border star-pick'
        ]
      }, 700)
    }
    
    this.rating = [
      'star-border star-pick', 
      'star-border star-pick', 
      'star-border star-pick', 
      'star-border star-pick', 
      'star-border star-pick'
    ]
    
    for(let i = 0; i <= index; i++) {
      this.rating[i] = 'star star-pick'
    }
  }
}

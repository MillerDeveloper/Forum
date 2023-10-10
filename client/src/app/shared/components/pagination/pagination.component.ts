import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() countPages: number = null
  @Output() changePage = new EventEmitter()
  @Output() scrollToTop = new EventEmitter()
  constructor() { }

  currentPage = 1
  pages = []
  max = 0
  min = 0

  ngOnInit(): void {
    this.max = this.countPages
    this.min = this.currentPage === 0 ? this.currentPage : this.currentPage - 1 
    this.show()
  }


  show() {
    this.min = this.currentPage === 0 ? this.currentPage : this.currentPage - 1 
    this.max = this.countPages - this.currentPage > 1 ? this.currentPage + 2 : this.countPages + 1

    for(let i = this.min || this.currentPage; i < this.max; i++) {
      if(i === this.currentPage) {
        this.pages.push({
          active: true,
          index: i
        })
      } else {
        this.pages.push({
          active: false, 
          index: i
        })
      }
    }
  }

  choosePage(page): void {
    this.pages = [] 
    this.currentPage = page.index
    this.changePage.emit(page)
    this.scrollTop()
    this.show()
  }

  move(next: boolean = true) {    
    if(next) {
      this.currentPage++
    } else {
      this.currentPage--
    }
    
    const index = this.pages.findIndex(pg => pg.active === true)
    if(index !== -1) {
      var page = this.pages[next ? index + 1 : index - 1]

      if(page) {
        this.choosePage(page)
      }
    }
  }

  firstPage() {
    this.currentPage = 1
    this.max = this.currentPage + 2
    this.min = 1

    this.pages = []
    this.show()
    this.changePage.emit({index: this.currentPage})
  }

  scrollTop() {
    this.scrollToTop.emit()
  }
}

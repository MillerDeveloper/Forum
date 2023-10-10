import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from '../../interfaces/Company';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Input() link: string = '/agencies'
  @Output() searchResult = new EventEmitter()

  constructor(private searchService: SearchService) { }
  searchTimeout: any
  subscription: Subscription = new Subscription()
  searchedCompanies: Company[]

  ngOnInit(): void {
  }

  search(event) {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.subscription.add(this.searchService.searchCompanies(event.target.value).subscribe(
        (result) => {          
          this.searchedCompanies = result
          this.searchResult.emit(result)
        },
        (error) => {console.log(error)}
      ))
    }, 200)
  }
 
  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe()
  }
}

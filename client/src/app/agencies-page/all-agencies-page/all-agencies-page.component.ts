import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { Company } from '../../shared/interfaces/Company';
import { CompanyService } from '../../shared/services/company/company.service';   

@Component({
  selector: 'app-all-agencies-page',
  templateUrl: './all-agencies-page.component.html',
  styleUrls: ['./all-agencies-page.component.scss']
})

export class AllAgenciesPageComponent implements OnInit, OnDestroy {
  @ViewChild('topBox') topBox: ElementRef

  constructor(
    private companyService: CompanyService,
    private searchService: SearchService,
    private title: Title,
    private meta: Meta,
    private seoService: SeoService,
  ) { 
    this.seoService.updateCanonical()
    
    this.title.setTitle('Каталог агентств по трудоустройству за рубежом')
    this.meta.updateTag(
      {name: 'title', content: 'Каталог агентств по трудоустройству за рубежом'}  
    )

    this.meta.updateTag(
      {name: 'keywords', content: 'Каталог агентств по трудоустройству агенства по трудоустройству лицензия список реестр за границей отзывы обман кидалово'}
    )

    this.meta.updateTag(
      {name: 'description', content: 'На нашем портале Вы сможете просмотреть агенства предоставляющие услуги по трудоустройству украинцев за рубежом.'}
    )
  }

  params: Params = { 
    limit: 5, 
    skip: 0
  }

  searchTimeout: any
  searchSubscription: Subscription
  companiesSubscription: Subscription 
  countCompanySubscription: Subscription

  noMoreCompanies: boolean = false

  countCompany: number = 0

  companies: Company[] = []
 
  ngOnInit(): void {
    this.fetch()
    this.getCountCompanies() 
  }

  fetch() {        
    this.companiesSubscription = this.companyService.getCompanies(this.params).subscribe(companies => {
      this.companies = companies
    })
  }

  getCountCompanies() {
    this.countCompanySubscription = this.companyService.getCountCompanies().subscribe(
      (count: number) => {        
        this.countCompany = count
      },
      (error) => {}
    )
  }

  filter(event: any, select) {
    if(event.target.value == '') delete this.params[select]
    this.params[select] = event.target.value
    this.fetch()
  }

  search(event: any) {
    if(event.target?.value?.length > 1) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.searchSubscription = this.searchService.searchCompanies(event.target.value).subscribe(
          (result) => {            
            this.companies = result
          },
          (error) => {console.log(error)} 
        )
      }, 200)
    } else {      
      this.params.skip = 0
      this.fetch()
    }
  }

  scrollToTop() {
    this.topBox.nativeElement.scrollIntoView({
      behavior: "smooth", 
      block: "start", 
      inline: "nearest"
    })
  }

  ngOnDestroy() {
    if(this.companiesSubscription) this.companiesSubscription.unsubscribe()
    if(this.searchSubscription) this.searchSubscription.unsubscribe()
    if(this.countCompanySubscription) this.countCompanySubscription.unsubscribe()
    if(this.searchTimeout) clearTimeout(this.searchTimeout)
  }
}

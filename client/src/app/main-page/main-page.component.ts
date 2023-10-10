import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from '../shared/interfaces/Company';
import { CompanyService } from '../shared/services/company/company.service';
import { SeoService } from '../shared/services/seo/seo.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'] 
})
export class MainPageComponent implements OnInit, OnDestroy {
 
  constructor(
    private companyService: CompanyService, 
    private title: Title,
    private meta: Meta,
    private seoService: SeoService
  ) { 
    this.seoService.updateCanonical()

    this.title.setTitle('Каталог агентств по трудоустройству. ТОП-10 агенств по трудоустройству')
    this.meta.updateTag(
      {name: 'title', content: 'Каталог агентств по трудоустройству. ТОП-10 агенств по трудоустройсву украинцев за рубежом'}
    )

    this.meta.updateTag(
      {name: 'keywords', content: 'Каталог агентств по трудоустройству агенства по трудоустройству лицензия список реестр за границей отзывы обман кидалово'}
    )
 
    this.meta.updateTag(
      {name: 'description', content: 'На нашем портале Вы сможете просмотреть агенства предоставляющие услуги по трудоустройству украинцев за рубежом.'}
    )
  }

  companies: Company[] = []
  visitors = {
    today: 0,
    total: 0
  }

  companiesSubscription: Subscription

  params: Params = {
    limit: 5,  
    sortBy: '-rating',
    isInTop: true
  }

  ngOnInit(): void {
    this.companiesSubscription = this.companyService.getCompanies(this.params).subscribe((companies: Company[]) => {
      this.companies = companies
    })
  }

  ngOnDestroy(): void {
    if(this.companiesSubscription) this.companiesSubscription.unsubscribe()
  }
}

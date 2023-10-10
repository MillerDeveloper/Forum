import { VerificationService } from 'src/app/shared/services/verification/verification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/interfaces/Company';
import { Subscription } from 'rxjs';

@Component({ 
  selector: 'app-companies-verification-page',
  templateUrl: './companies-verification-page.component.html',
  styleUrls: ['./companies-verification-page.component.scss']
})
export class CompaniesVerificationPageComponent implements OnInit, OnDestroy {
  constructor(private verificationService: VerificationService) { }

  notVerified = []

  subscriptions: Subscription = new Subscription()

  ngOnInit(): void {
    this.subscriptions.add(this.verificationService.getNotVerifiedCompanies().subscribe(
      (result) => {
        this.notVerified = result
      }
    ))
  } 

  allow(item, index, event) {
    event.stopPropagation()
    event.preventDefault()
    this.subscriptions.add(this.verificationService.allow(item).subscribe(
      () => {
        this.notVerified.splice(index, 1)
      }
    ))
  }

  disAllow(item, index, event) {
    event.stopPropagation()
    event.preventDefault()
    this.subscriptions.add(this.verificationService.disAllow(item).subscribe(
      () => {
        this.notVerified.splice(index, 1)
      }
    ))
  }
  
  ngOnDestroy() {
    if(this.subscriptions) this.subscriptions.unsubscribe()
  }
}

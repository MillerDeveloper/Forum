import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(@Inject(DOCUMENT) private doc) { }

  updateCanonical() {
    let canonicalOnPage = this.doc.querySelector('link[rel="canonical"]')

    if(!canonicalOnPage) {  
      let link: HTMLLinkElement = this.doc.createElement('link')
      link.setAttribute('rel', 'canonical')
      this.doc.head.appendChild(link)    
      link.setAttribute('href', `https://zarobitchany-za-kordonom.com${this.doc.location.pathname}`)
    } else {
      if(this.doc.location.pathname === '/') {
        canonicalOnPage.setAttribute('href', `https://zarobitchany-za-kordonom.com`)
      } else {
        canonicalOnPage.setAttribute('href', `https://zarobitchany-za-kordonom.com${this.doc.location.pathname}`)
      }
    }
  }
}

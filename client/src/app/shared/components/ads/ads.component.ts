import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit, OnDestroy {

  @Input() place = null

  constructor(private ngZone: NgZone) { }
  adsInterval: any 

  images: string[] = [
    '../../../../assets/bannerImages/banner2.jpg', 
    '../../../../assets/bannerImages/banner3.jpg',
    '../../../../assets/bannerImages/banner4.jpg',
    '../../../../assets/bannerImages/banner5.jpg',
    '../../../../assets/bannerImages/banner6.jpg',
    '../../../../assets/bannerImages/daikin.jpg',
    '../../../../assets/bannerImages/h&m.jpg',
    '../../../../assets/bannerImages/mdelectronic.jpg' 
  ] 

  currentIndexImage = Math.floor(Math.random() * this.images.length)
  
  ngOnInit(): void {
    this.ngZone.runOutsideAngular(()=>{
      this.adsInterval = setInterval(() => {
          this.ngZone.run(() => {
              this.nextAd()
          })
      }, 3000)
    })
  }

  nextAd() {
    if(this.currentIndexImage < this.images.length - 1) {
      this.currentIndexImage++
    } else {
      this.currentIndexImage = 0
    } 
  }
   
  ngOnDestroy() {
    if(this.adsInterval) clearInterval(this.adsInterval)  
  } 
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient) { } 

  getNotVerifiedCompanies(): Observable<any> {
   return this.http.get(`${environment.server}/api/verification`) 
  }

  allow(item) {
    return this.http.post(`${environment.server}/api/verification/allow`, item) 
  }

  disAllow(item) {
    return this.http.post(`${environment.server}/api/verification/disAllow`, item)
  }
}

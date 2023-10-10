import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getAllAnalytics(): Observable<any>{
    return this.http.get(`${environment.server}/api/analytics`) 
  }

  updateAnalytics(data): Observable<any>{
    return this.http.put(`${environment.server}/api/analytics`, data) 
  }

  updateCountVisitors(): Observable<any>{
    return this.http.get(`${environment.server}/api/analytics/updateCountVisitors`) 
  }
}

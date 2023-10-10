import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginData): Observable<any>{
    return this.http.post(`${environment.server}/api/auth/login`, loginData)
  }

  register(registerData): Observable<any>{
    return this.http.post(`${environment.server}/api/auth/register`, registerData)
  }
  
  isAuthtenticated() {
    return localStorage.getItem('token')
  }
}

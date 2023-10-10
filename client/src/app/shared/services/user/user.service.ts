import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  currentUser: User

  getCurrentUserIp() {
    return this.http.get('https://json.geoiplookup.io')
  }

  setUser(user: User): void {
    this.currentUser = user
  }

  getUser(): User | null {
    return this.currentUser
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.server}/api/user`) 
  }

  getNotModerated(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.server}/api/user/verify/fetch`)
  }

  getCurrentUserCompanies(): Observable<any> {
    return this.http.get(`${environment.server}/api/user/getUserCompanies`)
  }

  clearUserData() { 
    localStorage.removeItem('token') 
    localStorage.removeItem('lastUserName')
  }

  updateAvatar(formData, idUser: string) {
    return this.http.post(`${environment.server}/api/user/updateAvatar/${idUser}`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  allowUser(user: User) {
    return this.http.post(`${environment.server}/api/user/verify/allowUser`, user)
  }

  disAllowUser(user: User) {
    return this.http.post(`${environment.server}/api/user/verify/disAllowUser`, user)
  }
}

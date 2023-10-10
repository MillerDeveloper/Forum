import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class CabinetService {

  constructor(private http: HttpClient) { }

  updateUserPassword(data: Object): Observable<User> {
    return this.http.patch<User>(`${environment.server}/api/user/changePassword`, data)
  }

  updateUserData(data: Object): Observable<any> {
    return this.http.patch<any>(`${environment.server}/api/user/updateData`, data) 
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  searchCompanies(searchValue: string): Observable<any> {
    return this.http.post<string>(`${environment.server}/api/search`, {searchValue})
  }
}

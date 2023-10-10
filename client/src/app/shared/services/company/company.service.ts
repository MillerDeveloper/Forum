import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from '../../interfaces/Company'
import { Comment } from '../../interfaces/Comment'

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { } 

  getCompanies(params: Params = {}): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.server}/api/companies`, {
      params: new HttpParams({ 
          fromObject: params 
      })
    }) 
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${environment.server}/api/companies/${id}`)
  }

  createCompany(data: Company): Observable<Company> {
    return this.http.post<Company>(`${environment.server}/api/companies/`, data)
  }

  companyRequest(data: Company): Observable<any> {
    return this.http.post(`${environment.server}/api/companies/companyRequest`, data) 
  }

  delete(company: Company): Observable<any> {
    return this.http.delete(`${environment.server}/api/companies/${company._id}`)
  }

  update(company: Company, idCompany: string): Observable<Company> {
    return this.http.put<Company>(`${environment.server}/api/companies/${idCompany}`, company)
  }

  updateAvatar(formdata, idCompany: string): Observable<any>{
    return this.http.post(`${environment.server}/api/companies/updateAvatar/${idCompany}`, formdata, {
      reportProgress: true,
      observe: 'events'
    })
  }

  updateVisitors(company: Company) {
    return this.http.get<Company>(`${environment.server}/api/companies/updateVisitors/${company._id}`)
  }

  getCountCompanies() {
    return this.http.get(`${environment.server}/api/companies/getCountCompanies`)
  }
}
 
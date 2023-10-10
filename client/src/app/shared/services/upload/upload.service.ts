import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  updateImage(formdata): Observable<any> {
    return this.http.post(`${environment.server}/api/files/upload`, formdata)
    // .catch(this.errorHandler);
  }
}

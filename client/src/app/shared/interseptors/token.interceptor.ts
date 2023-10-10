import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
      private router: Router,
      private authService: AuthService
  ){ }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(this.authService.isAuthtenticated()) {
          req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
              }
          })
      }
      return next.handle(req).pipe(
          catchError(
              (error: HttpErrorResponse) => this.handleAuthError(error)
          )
      )
  }
  
  private handleAuthError(error: HttpErrorResponse): Observable<any> {
      if(error.status === 401) {
        //   this.router.navigate(['/auth/login'], {
        //       queryParams: {
        //           sessionFailed: true
        //       }
        //   })

        localStorage.removeItem('token')
        localStorage.removeItem('lastUserName')
      }

      return throwError(error)
  }    
}
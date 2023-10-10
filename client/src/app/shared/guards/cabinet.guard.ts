import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CabinetGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if(this.auth.isAuthtenticated()) {
            return of(true);
        } else {
            this.router.navigate(['/auth/login'], {
                queryParams: {
                accessDenied: true
            }
        })
            return of(false);
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state)
    }
}

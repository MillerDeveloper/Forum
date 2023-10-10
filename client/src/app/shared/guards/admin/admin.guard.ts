import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if(this.authService.isAuthtenticated()) {
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

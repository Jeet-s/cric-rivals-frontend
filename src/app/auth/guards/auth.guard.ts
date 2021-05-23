import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let isAuthenticated = await this.auth.isAuthenticated();
    if (!isAuthenticated) {
      console.log('login');
      this.router.navigate(['/auth']);
      return false;
    }

    console.log('guard', isAuthenticated);

    return isAuthenticated;
  }
}

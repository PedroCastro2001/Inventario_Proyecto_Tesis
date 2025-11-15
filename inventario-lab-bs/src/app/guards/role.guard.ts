import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as Array<string>;
    const userRole = localStorage.getItem('rol');

    if (allowedRoles && allowedRoles.includes(userRole!)) {
      return true;
    }

    // Si no tiene permiso, redirige a otra página (por ejemplo, dashboard)
    this.router.navigate(['/']);
    return false;
  }
}
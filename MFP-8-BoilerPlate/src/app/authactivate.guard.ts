import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppConfigService } from './shared/services/app-config.service';
import { NavigationService } from './shared/services/navigation.service';

@Injectable()
export class AuthActivateGuard implements CanActivate {
  appConfigLocal;

  constructor(private appConfig: AppConfigService,
    private navigationService: NavigationService) {
    this.appConfigLocal = appConfig;
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    if ( this.appConfigLocal.isAuthenticated ) {
      return true;
    } else {
      this.navigationService.startNewFlow('/login');
      return false;
    }
  }
}

import {filter, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AlertService, AppService} from '../_services';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private appService: AppService,
    private alertService: AlertService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.alertService.alertClose();
    const url = state.url.split('/')[1].split('?')[0];
    const getToken = localStorage.getItem('currentUser');
    if (url !== 'login') {
      this.appService.checkLogin(getToken)
        .pipe(map(data => (data as any).data))
        .subscribe(data => {
            if (data.passwordChangeRequired) {
              this.router.navigate(['/profile-settings'], {queryParams: {tab: 'password-change'}});
            }
          },
          err => {
            window.localStorage.removeItem('currentUser');
            this.router.navigate(['/login']);
          }
        );
    }

    if (localStorage.getItem('currentUser') != null) {
      if (url !== 'login') {
        this.appService.getMenuObservable()
          .pipe(filter(data => data != null))
          .subscribe(data => {
            const routes = data
              .flatMap(x => x.subMenus)
              .flatMap(x => x.route)
              .concat(data.map(x => x.route));
            console.log(url);
            if (routes.indexOf(url) < 0) {
              this.router.navigate(['/dashboard']);
            }
          });
      } else {
        this.router.navigate(['/dashboard']);
      }

      // logged in so return true
      return true;
    } else {

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }

  }
}

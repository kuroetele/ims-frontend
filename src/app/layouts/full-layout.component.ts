import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService, SettingService} from '../_services/index';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
  userData = {
    profileName: '',
    image: '',
    passwordChangeRequired: false
  };
  showDNClass = false;
  setting: any = {};
  showMenu = false;
  nav: any;
  public disabled = false;
  public status: { isopen: boolean } = {isopen: false};

  constructor(public router: Router, private dataService: AppService, private settingService: SettingService) {
    this.dataService.getProfileObservable()
      .pipe(map(data => (data as any)))
      .subscribe(data => {
        console.log(data);
        this.userData.profileName = data.name;
        this.userData.image = data.image;
        this.userData.passwordChangeRequired = data.passwordChangeRequired;
        this.showMenu = !data.passwordChangeRequired;
      });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showDNClass = true;
      this.dataService.fetchMenu()
        .pipe(map(data => (data as any).data))
        .subscribe(data => {
          console.log(data);
          this.dataService.setMenu(data);
          // this.nav = data;
          this.nav = this.filterVisibleMenuItems(data);
          this.showMenu = !this.userData.passwordChangeRequired;
        });
    }, 200);

    this.settingService.getSettingSubject().subscribe(data => {
      this.setting = data;
    });
  }

  public logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private filterVisibleMenuItems(menus: any[]): any {
    const newMenus: any[] = [];
    menus.forEach(m => {
      const newMenu = {...m};
      if (newMenu.visible) {
        newMenu.subMenus = m.subMenus.filter(s => s.visible);
        newMenus.push(newMenu);
      }
    });
    return newMenus;
  }
}

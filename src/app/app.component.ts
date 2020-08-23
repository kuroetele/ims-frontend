import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService, SettingService} from './_services';
import {Title} from '@angular/platform-browser';
import {map} from 'rxjs/operators';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  getToken: string;
  title = 'app';
  getSetting: any;
  setting = {};

  constructor(
    private dataService: AppService,
    private settingService: SettingService,
    public router: Router,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.settingData();
    this.settingService.getSettingSubject()
      .pipe(map(data => (data as any)))
      .subscribe(data => {
        this.titleService.setTitle(data.companyName);
      });
  }

  settingData() {
    this.settingService.fetchSettingData()
      .pipe().subscribe(data => {
      this.getSetting = (data as any).data;
      this.setting = {
        id: this.getSetting.id,
        companyName: this.getSetting.companyName,
        address: this.getSetting.address,
        phone: this.getSetting.phone,
        email: this.getSetting.email,
        currency: this.getSetting.currency,
        vatPercentage: this.getSetting.vatPercentage,
        image: this.getSetting.image
      };
      this.settingService.emitSettingData(this.setting);
      localStorage.setItem('setting', JSON.stringify(this.setting));
    });
  }

}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, SettingService} from '../_services';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  token: string;
  textMessage: any;
  show = false;
  model: any = {};
  loading = false;
  setting = {image: ''};

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dataService: AuthenticationService,
    private settingService: SettingService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.settingService.getSettingSubject()
      .pipe(map(data => data as any))
      .subscribe(data => {
        this.setting = {image: data.image};
      });
  }

  onLoggedIn() {
    this.loading = true;

    const UserInput = {
      username: this.model.username,
      password: this.model.password
    };

    if (this.model.username !== undefined && this.model.password !== undefined) {

      this.dataService.login(UserInput)
        .pipe().subscribe(
        data => {
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.show = true;
          this.textMessage = error;
          this.loading = false;
          this.alertService.error(error);
        });
    }

  }

}

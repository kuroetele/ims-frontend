import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, SettingService} from '../_services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  token: string;
  textMesg: any;
  show = false;
  model: any = {};
  loading = false;
  returnUrl: string;
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

    if (localStorage.getItem('currentUser') != null) {
      // this.router.navigate(['/dashboard']);
    }
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.settingService.getSettingSubject()
      .subscribe(data => {
        this.setting = {image: (data as any).image};
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
          this.textMesg = error;
          this.loading = false;
          this.alertService.error(error);
        });
    }

  }

}

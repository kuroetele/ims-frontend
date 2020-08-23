import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, AppService} from '../_services';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {Util} from '../_helpers/util';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent implements OnInit, AfterViewInit {
  profileAddForm: FormGroup;
  profile = {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    image: ''
  };
  password = {
    id: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  @Input() allowMultiple: boolean;
  @Input() fileType: string;
  @Input() required: boolean;
  @Input() maxSizeInKb: number;
  @Output() onSelection = new EventEmitter<FileList>();
  displayedText = '';
  fileList: any;
  getToken: string;
  showLoading = true;
  loadingImage = false;
  redirectToDashboard = false;
  @ViewChild('tabs', {static: true, read: NgbTabset})
  private tabs: NgbTabset;

  constructor(
    private dataService: AppService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.showLoading = false;
      this.loadingImage = true;
    }, 500);
    this.profileAddForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      phone: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl(''),
      address: new FormControl('', Validators.compose([Validators.required])),
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
    });
    this.profileData();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if (params.tab) {
        this.tabs.select(params.tab);
        this.redirectToDashboard = params.tab === 'password-change';
      }
    });
  }

  profileData() {
    this.getToken = window.localStorage.getItem('currentUser');
    this.dataService.checkLogin(this.getToken)
      .pipe().subscribe(data => {
      const user = (data as any).data;
      this.profile = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        image: user.image
      };
      this.password.id = user.id;
      this.dataService.emitProfileData(user);
    });
  }

  updateProfile(val) {
    this.insertAction(val);
  }

  updatePassword() {
    if (this.password.currentPassword === '') {
      this.alertService.error('Please type current Password');
    } else if (this.password.newPassword === '') {
      this.alertService.error('Please type new Password');
    } else if (this.password.confirmPassword === '') {
      this.alertService.error('Please Type confirm Password');
    } else if (this.password.newPassword !== this.password.confirmPassword) {
      this.alertService.error('Confirm Password and new Password don\'t match');
    } else {
      this.dataService.updatePassword(this.password)
        .subscribe(data => {
          this.alertService.success('Password Update successful', true);
          this.profileData();
          if (this.redirectToDashboard) {
            this.router.navigate(['/dashboard']);
          }
        }, error => {
          this.alertService.error(error);
        });
    }
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
    // let filetypeToCompare = this.fileType.replace('*','');
    const hasFile = this.fileList && this.fileList.length > 0;
    if (hasFile) {
      const extension = this.fileList[0].name.substring(this.fileList[0].name.lastIndexOf('.'));
      // Only process image files.
      const validFileType = '.jpg , .png , .bmp';
      if (validFileType.toLowerCase().indexOf(extension) < 0) {
        alert('please select valid file type. The supported file types are .jpg , .png , .bmp');
        this.fileList = null;
        this.displayedText = '';
        return false;
      }
      if (this.fileList[0].size > 65535) {
        alert(`File size is more than 65 Kb`);
        this.fileList = null;
        this.displayedText = '';
        return false;
      }
      const multipleFile = this.fileList.length > 1;
      if (multipleFile) {
        this.displayedText = this.fileList.length + ' file(s) has been selected';
      } else {
        const file: File = this.fileList[0];
        this.displayedText = file.name;
      }
      this.onSelection.emit(this.fileList);
    }
  }

  async insertAction(val) {
    const formData: FormData = new FormData();
    if (this.fileList !== undefined) {
      const file: File = this.fileList[0];
      await Util.toBase64(file).then(value => {
        formData.append('image', value as string);
      });
    }
    if (val.id !== undefined) {
      formData.append('id', val.id);
    }

    formData.append('name', this.profile.name);
    formData.append('phone', this.profile.phone);
    formData.append('address', this.profile.address);

    this.dataService.profileUpdate(formData)
      .subscribe(data => {
        this.alertService.success('Profile Update successful', true);
        this.profileData();
      }, error => {
        this.alertService.error(error);
      });
  }
}

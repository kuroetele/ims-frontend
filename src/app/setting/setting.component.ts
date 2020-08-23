import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, SettingService} from '../_services/index';
import {Util} from '../_helpers/util';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {
  settingAddForm: FormGroup;
  setting = {
    id: '',
    companyName: '',
    vatPercentage: '',
    address: '',
    phone: '',
    email: '',
    currency: '',
    loyaltyPointsPercentage: null,
    image: ''
  };

  @Input() allowMultiple: boolean;
  @Input() fileType: string;
  @Input() required: boolean;
  @Input() maxSizeInKb: number;
  @Output() onSelection = new EventEmitter<FileList>();
  DisplayedText = '';
  fileList: any;
  showloding = true;
  lodingImage = false;

  constructor(
    public router: Router,
    private dataService: SettingService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);
    this.settingAddForm = new FormGroup({
      companyName: new FormControl('', Validators.compose([Validators.required])),
      vatPercentage: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      loyaltyPointsPercentage: new FormControl(''),
      phone: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required])),
      currency: new FormControl('', Validators.compose([Validators.required]))
    });
    this.settingData();
  }

  settingData() {
    this.dataService.fetchSettingData()
      .pipe().subscribe(data => {
      const setting = (data as any).data;
      this.setting = {
        id: setting.id,
        companyName: setting.companyName,
        vatPercentage: setting.vatPercentage,
        address: setting.address,
        phone: setting.phone,
        email: setting.email,
        loyaltyPointsPercentage: setting.loyaltyPointsPercentage,
        currency: setting.currency,
        image: setting.image
      };
      this.dataService.emitSettingData(this.setting);
    });
  }

  Update() {
    this.insertAction();

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
        this.DisplayedText = '';
        return false;
      }
      if (this.fileList[0].size > 65535) {
        alert(`File size is more than 65 Kb`);
        this.fileList = null;
        this.DisplayedText = '';
        return false;
      }
      const multipleFile = this.fileList.length > 1;
      if (multipleFile) {
        this.DisplayedText = this.fileList.length + ' file(s) has been selected';
      } else {
        const file: File = this.fileList[0];
        this.DisplayedText = file.name;
      }
      this.onSelection.emit(this.fileList);
    }
  }

  async insertAction() {
    const formData: FormData = new FormData();
    if (this.fileList !== undefined) {
      const file: File = this.fileList[0];
      await Util.toBase64(file).then(value => {
        formData.append('image', value as string);
      });
    }

    formData.append('companyName', this.setting.companyName);
    formData.append('phone', this.setting.phone);
    formData.append('email', this.setting.email);
    formData.append('address', this.setting.address);
    formData.append('currency', this.setting.currency);
    formData.append('loyaltyPointsPercentage', this.setting.loyaltyPointsPercentage);
    formData.append('vatPercentage', this.setting.vatPercentage);
    formData.append('id', JSON.parse(localStorage.getItem('setting')).id);

    this.dataService.settingUpdate(formData)
      .pipe().subscribe(data => {
      this.alertService.success('Setting Update successful', true);
      this.settingData();
    }, error => {
      this.alertService.error(error);
    });
  }
}

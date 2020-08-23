import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, AppService, UserService} from '../_services';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {appConfig} from '../app.config';
import {Util} from '../_helpers/util';
import {map} from 'rxjs/operators';

const REPORT_COLUMNS = [0, 1, 2, 3, 4, 5, 6];

class User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  passwordChangeRequired = false;
  role: string;
  deleted: boolean;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  @Input() allowMultiple: boolean;
  @Input() fileType: string;
  @Input() required: boolean;
  @Input() maxSizeInKb: number;
  @Output() onSelection = new EventEmitter<FileList>();
  DisplayedText: string = '';
  fileList: any;
  pdf = false;
  exl = false;
  dtOptions = {
    dom: 'Bfrtip',
    buttons: [
      Util.excelButton(REPORT_COLUMNS, 'User Report'),
      Util.pdfButton(REPORT_COLUMNS, 'User Report')
    ]
  }; //  DataTable
  dtTrigger = new Subject(); //  DataTable
  userList: User[] = []; // Table Data list
  userAddForm: FormGroup;
  getUser = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    deleted: false,
    image: ''
  };
  roles = [];
  user = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    deleted: false,
    image: ''
  };
  modalReference: NgbActiveModal;
  options: NgbModalOptions = {size: 'lg'};
  modalTitle: string;
  showloding = true;
  lodingImage = false;

  constructor(
    public router: Router,
    private dataService: UserService,
    private alertService: AlertService,
    private appService: AppService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);

    // form validaion
    this.userAddForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      phone: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl(''),
      role: new FormControl('', Validators.compose([Validators.required])),
      deleted: new FormControl(''),
    });

    this.getUserRoles();
    this.allUser();
  }

  getUserRoles() {
    this.dataService.getUserRoles()
      .pipe(map(data => (data as any).data))
      .subscribe(data => {
        this.roles = data;
      });
  }

  allUser() {
    this.dataService.getAllUsers()
      .pipe().subscribe(data => {
      this.userList = (data as any).data;
      this.dtTrigger.next(); // Data Table
      this.pdf = true;
      this.exl = true;
    });
  }

  save(val) {
    this.insertAction(val);
  }

  viewUserPermission(id) {
    this.router.navigate(['user-role/' + id]);
  }

  edit(id, content) {
    // alert('Live Demo Button Not Working');
    this.loadHide();
    this.modalTitle = 'Edit User';

    this.dataService.getUser(id)
      .pipe().subscribe(data => {
      this.getUser = (data as any).data;
      this.user = {
        id: this.getUser.id,
        name: this.getUser.name,
        email: this.getUser.email,
        phone: this.getUser.phone,
        address: this.getUser.address,
        role: this.getUser.role,
        deleted: this.getUser.deleted,
        image: this.getUser.image
      };

      this.modalReference = this.modalService.open(content);
    });

  }

  open(content) {
    this.DisplayedText = '';
    this.user = {id: '', name: '', email: '', phone: '', address: '', role: '', deleted: false, image: ''};
    this.modalTitle = 'Add User';
    this.modalReference = this.modalService.open(content);
  }


  fileChange(event: any) {
    this.fileList = event.target.files;
    // let filetypeToCompare = this.fileType.replace('*','');
    let hasFile = this.fileList && this.fileList.length > 0;
    if (hasFile) {
      var extension = this.fileList[0].name.substring(this.fileList[0].name.lastIndexOf('.'));
      // Only process image files.
      var validFileType = '.jpg , .png , .bmp';
      if (validFileType.toLowerCase().indexOf(extension) < 0) {
        alert('please select valid file type. The supported file types are .jpg , .png , .bmp');
        this.fileList = null;
        this.DisplayedText = '';
        return false;
      }

      if (this.fileList[0].size > 165535) {
        alert(`File size is more than 165 Kb`);
        this.fileList = null;
        this.DisplayedText = '';
        return false;
      }

      let multipleFile = this.fileList.length > 1;
      if (multipleFile) {
        this.DisplayedText = this.fileList.length + ' file(s) has been selected';
      } else {
        let file: File = this.fileList[0];
        this.DisplayedText = file.name;
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
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('phone', this.user.phone);
    formData.append('address', this.user.address);
    formData.append('role', this.user.role);
    formData.append('deleted', this.user.deleted + '');

    if (val.id === undefined || val.id === '') {
      this.dataService.save(formData)
        .pipe().subscribe(data => {
        this.modalReference.close();
        this.dtTrigger = new Subject(); //  DataTable
        this.allUser();
        this.alertService.success('User Create successful', true);
      }, error => {
        this.alertService.error(error);
      });
    } else {
      formData.append('id', val.id);
      this.dataService.userUpdate(formData)
        .pipe().subscribe(data => {
        this.modalReference.close();
        this.dtTrigger = new Subject(); //  DataTable
        this.allUser();
        this.alertService.success('User Update successful', true);
      }, error => {
        this.alertService.error(error);
      });
    }
  }


  pdfExport() {
    window.open(appConfig.apiUrl + '/api/user-list-pdf', '_blank');
  }

  xlExport() {
    window.open(appConfig.apiUrl + '/api/user-list-excel', '_blank');
  }

  loadShow() {
    this.showloding = true;
    this.lodingImage = false;
  }

  loadHide() {
    this.showloding = false;
    this.lodingImage = true;
  }
}

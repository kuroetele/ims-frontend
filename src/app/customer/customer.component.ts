import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, AppService, CustomerService} from '../_services/index';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {appConfig} from '../app.config';
import {Util} from '../_helpers/util';

class Customer {
  id: number;
  name: string;
  phone: string;
  loyaltyPoints: number;
  address: string;
  deleted: boolean;
}

const REPORT_COLUMNS = [0, 1, 2, 3, 4, 5];

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {

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
      Util.excelButton(REPORT_COLUMNS, 'Customer Report'),
      Util.pdfButton(REPORT_COLUMNS, 'Customer Report')
    ]
  }; //  DataTable
  dtTrigger = new Subject(); //  DataTable
  customerList: Customer[] = []; // Table Data list
  customerAddForm: FormGroup;
  getCustomer = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    deleted: false,
    loyaltyPoints: 0,
    image: ''
  };
  customerInfo = {
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0,
    customerPurchase: [],
    image: ''
  };
  customer = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0,
    deleted: false,
    image: ''
  };
  setting = {currency: ''};
  modalReference: NgbActiveModal;
  // customerinfo: ElementRef
  options: NgbModalOptions = {size: 'lg'};
  modalTitle: string;
  showloding = true;
  lodingImage = false;

  constructor(
    public router: Router,
    private dataService: CustomerService,
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
    this.customerAddForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      phone: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      deleted: new FormControl('')
    });

    this.allCustomer();
    const settingData = JSON.parse(localStorage.getItem('setting'));
    this.setting = {currency: settingData.currency};
  }

  allCustomer() {
    this.dataService.getAllCustomer()
      .pipe().subscribe(data => {
      this.customerList = (data as any).data;
      this.dtTrigger.next(); // Data Table
      this.pdf = true;
      this.exl = true;
    });
  }


  edit(id, content) {
    this.loadShow();
    this.DisplayedText = '';
    this.dataService.getCustomer(id)
      .pipe().subscribe(data => {
      this.getCustomer = (data as any).data;
      this.customer = {
        id: this.getCustomer.id,
        name: this.getCustomer.name,
        email: this.getCustomer.email,
        phone: this.getCustomer.phone,
        address: this.getCustomer.address,
        loyaltyPoints: this.getCustomer.loyaltyPoints,
        deleted: this.getCustomer.deleted,
        image: this.getCustomer.image
      };
      this.loadHide();
      this.modalTitle = 'Edit Customer';
      this.modalReference = this.modalService.open(content);
    });


  }

  open(content) {
    this.loadShow();
    if (this.getCustomer.id != null) {
      this.getCustomer.id = '';
      this.getCustomer.image = '';
    }
    this.DisplayedText = '';
    this.customer = {id: '', name: '', email: '', phone: '', address: '', loyaltyPoints: 0, deleted: false, image: ''};
    this.modalTitle = 'Add Customer';
    this.loadHide();
    this.modalReference = this.modalService.open(content);
  }

  save(val) {
    this.insertAction(val);
  }


  openCustomerInfoModal(id, customerinfo, customer) {
    this.loadShow();
    this.customerInfo.image = '';
    console.log(customerinfo);
    this.dataService.getCustomerInfo(id)
      .pipe().subscribe(data => {
      const orders = (data as any).data;
      this.customerInfo = {
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        loyaltyPoints: customer.loyaltyPoints,
        customerPurchase: orders,
        image: customer.image
      };
    });
    this.loadHide();

    this.modalReference = this.modalService.open(customerinfo, this.options);
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

    let formData: FormData = new FormData();
    if (this.fileList !== undefined) {
      const file: File = this.fileList[0];
      await Util.toBase64(file).then(value => {
        formData.append('image', value as string);
      });
    }

    formData.append('name', this.customer.name);
    formData.append('phone', this.customer.phone);
    formData.append('email', this.customer.email);
    formData.append('address', this.customer.address);
    formData.append('deleted', this.customer.deleted + '');

    if (val.id == undefined || val.id == '') {

      this.dataService.save(formData)
        .pipe().subscribe(data => {
        this.dtTrigger = new Subject(); //  DataTable
        this.modalReference.close();
        this.alertService.success('Customer Create successful', true);
        this.allCustomer();
      }, error => {
        this.alertService.error(error);
      });
    } else {

      formData.append('id', val.id);
      this.dataService.customerUpdate(formData)
        .pipe().subscribe(data => {
        this.dtTrigger = new Subject(); //  DataTable
        this.modalReference.close();
        this.alertService.success('Customer Update successful', true);
        this.allCustomer();
      }, error => {
        this.alertService.error(error);
      });
    }

  }

  pdfExport() {
    window.open(appConfig.apiUrl + '/api/customer-list-pdf', '_blank');
  }

  xlExport() {
    window.open(appConfig.apiUrl + '/api/customer-list-excel', '_blank');
  }

  loadShow() {
    this.showloding = true;
    this.lodingImage = false;
  }

  loadHide() {
    this.showloding = false;
    this.lodingImage = true;
  }

  salesInvoiceDetails(id) {
    this.modalReference.close();
    this.router.navigate(['sales-invoice-details/' + id]);
  }

}

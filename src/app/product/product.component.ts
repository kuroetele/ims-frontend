import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, AppService, ProductService} from '../_services/index';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Util} from '../_helpers/util';

class Product {
  id: number;
  serialNumber: string;
  costPrice: number;
  price: number;
  category: any;
  availableQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  name: string;
  deleted: false;
}

const REPORT_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  @Input() allowMultiple: boolean;
  @Input() fileType: string;
  @Input() required: boolean;
  @Input() maxSizeInKb: number;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelection = new EventEmitter<FileList>();
  DisplayedText = '';
  fileList: any;
  pdf = false;
  exl = false;
  dtOptions = {
    dom: 'Bfrtip',
    buttons: [
      Util.excelButton(REPORT_COLUMNS, 'Product Report'),
      Util.pdfButton(REPORT_COLUMNS, 'Product Report')
    ]
  }; //  DataTable
  dtTrigger = new Subject(); //  DataTable
  productList: Product[] = []; // Table Data list
  productAddForm: FormGroup;
  getProduct = {
    id: '',
    serialNumber: '',
    name: '',
    categoryId: 0,
    price: '',
    costPrice: '',
    minQuantity: '',
    maxQuantity: '',
    availableQuantity: '',
    deleted: false,
    image: ''
  };
  productInfo = {
    id: '',
    serialNumber: '',
    name: '',
    category: {},
    price: '',
    costPrice: '',
    minQuantity: '',
    maxQuantity: '',
    availableQuantity: '',
    deleted: false,
    image: ''
  };
  product = {
    id: '',
    serialNumber: '',
    name: '',
    categoryId: 0,
    price: '',
    costPrice: '',
    availableQuantity: '',
    minQuantity: '',
    maxQuantity: '',
    deleted: false,
    image: ''
  };
  modalReference: NgbActiveModal;
  modalTitle: string;
  cat = {};
  setting = {currency: ''};
  showLoading = true;
  loadingImage = false;

  constructor(
    public router: Router,
    private dataService: ProductService,
    private alertService: AlertService,
    private appService: AppService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.showLoading = false;
      this.loadingImage = true;
    }, 500);
    this.productAddForm = new FormGroup({
      serialNumber: new FormControl(''),
      name: new FormControl('', Validators.compose([Validators.required])),
      categoryId: new FormControl('', Validators.compose([Validators.required])),
      availableQuantity: new FormControl('', Validators.compose([Validators.required])),
      minQuantity: new FormControl('', Validators.compose([Validators.required])),
      maxQuantity: new FormControl('', Validators.compose([Validators.required])),
      costPrice: new FormControl('', Validators.compose([Validators.required])),
      price: new FormControl('', Validators.compose([Validators.required])),
      deleted: new FormControl(''),
    });

    this.allProduct();

    this.dataService.getCategory()
      .pipe()
      .subscribe(data => {
        this.cat = (data as any).data.filter(c => !c.deleted);
      });
    const settingData = JSON.parse(localStorage.getItem('setting'));
    this.setting = {currency: settingData.currency};
  }

  allProduct() {
    this.dataService.getAllProduct()
      .pipe().subscribe(
      data => {
        this.productList = (data as any).data;
        this.dtTrigger.next(); // Data Table
        this.pdf = true;
        this.exl = true;
      });
  }

  open(content) {

    if (!this.getProduct.id) {
      this.getProduct.id = '';
    }

    this.getProduct.id = '';
    this.product.serialNumber = new Date().getTime().toString();
    this.product.name = '';
    this.product.costPrice = '';
    this.product.price = '';
    this.product.minQuantity = '';
    this.product.maxQuantity = '';
    this.product.availableQuantity = '';
    this.product.categoryId = 0;
    this.product.deleted = false;
    this.product.image = '';

    this.DisplayedText = '';
    this.modalTitle = 'Add Product';
    this.modalReference = this.modalService.open(content);

  }

  save(val) {
    this.insertAction(val);
  }

  edit(id, content) {
    this.loadShow();
    this.DisplayedText = '';
    this.dataService.getProduct(id)
      .subscribe(data => {
        this.getProduct = (data as any).data;
        this.product = {
          id: this.getProduct.id,
          serialNumber: this.getProduct.serialNumber,
          name: this.getProduct.name,
          categoryId: (data as any).data.category.id,
          price: this.getProduct.price,
          costPrice: this.getProduct.costPrice,
          availableQuantity: this.getProduct.availableQuantity,
          minQuantity: this.getProduct.minQuantity,
          maxQuantity: this.getProduct.maxQuantity,
          deleted: this.getProduct.deleted,
          image: this.getProduct.image
        };
        this.loadHide();
        this.modalTitle = 'Edit Product';
        this.modalReference = this.modalService.open(content);
      });

  }

  openProductInfoModal(id, customerInfo) {
    this.loadShow();
    this.productInfo.image = '';
    this.dataService.getProductInfo(id)
      .pipe().subscribe(data => {
      const product = (data as any).data;
      this.productInfo = {
        id: product.id,
        serialNumber: product.serialNumber,
        name: product.name,
        category: product.category,
        costPrice: product.costPrice,
        price: product.price,
        availableQuantity: product.availableQuantity,
        minQuantity: product.minQuantity,
        maxQuantity: product.maxQuantity,
        deleted: product.deleted,
        image: product.image
      };
    });
    this.loadHide();
    this.modalReference = this.modalService.open(customerInfo);
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

      if (this.fileList[0].size > 165535) {
        alert(`File size is more than 165 Kb`);
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

  async insertAction(val) {
    if (this.productAddForm.value.minQuantity < this.productAddForm.value.maxQuantity) {
      this.alertService.error('min quantity cannot be less than max quantity');
    }
    const formData: FormData = new FormData();
    if (this.fileList !== undefined) {
      const file: File = this.fileList[0];
      await Util.toBase64(file).then(value => {
        formData.append('image', value as string);
      });
    }
    formData.append('serialNumber', this.productAddForm.value.serialNumber);
    formData.append('name', this.productAddForm.value.name);
    formData.append('categoryId', this.productAddForm.value.categoryId);
    formData.append('costPrice', this.productAddForm.value.costPrice);
    formData.append('price', this.productAddForm.value.price);
    formData.append('deleted', this.productAddForm.value.deleted + '');
    formData.append('availableQuantity', this.productAddForm.value.availableQuantity);
    formData.append('minQuantity', this.productAddForm.value.minQuantity);
    formData.append('maxQuantity', this.productAddForm.value.maxQuantity);

    if (!val.id) {
      this.dataService.save(formData)
        .pipe().subscribe(data => {
        this.modalReference.close();
        this.dtTrigger = new Subject(); //  DataTable
        this.allProduct();
        this.alertService.success('Product Create successful', true);
      }, error => {
        this.alertService.error(error);
      });
    } else {
      formData.append('id', val.id);
      this.dataService.productUpdate(formData)
        .pipe().subscribe(data => {
        this.modalReference.close();
        this.dtTrigger = new Subject(); //  DataTable
        this.allProduct();
        this.alertService.success('Product update successful', true);
      }, error => {
        this.alertService.error(error);
      });
    }
  }

  loadShow() {
    this.showLoading = true;
    this.loadingImage = false;
  }

  loadHide() {
    this.showLoading = false;
    this.loadingImage = true;
  }
}

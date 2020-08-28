import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, SalesService, SettingService} from '../_services/index';
import * as moment from 'moment';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {
  salesAddForm = null;
  sales: any = {};
  vat = 0;
  selectedCustomer: any = {};
  allCustomer: any[] = [];
  categoryList: any[] = [];
  productList: any[] = [];
  paymentTypeList = [];
  showLoading = true;
  loadingImage = false;
  loyaltyPoints = 0;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dataService: SalesService,
    private settingService: SettingService
  ) {
    this.settingService.getSettingSubject()
      .pipe(map(data => data as any))
      .subscribe(data => {
        this.vat = data.vatPercentage;
      });
  }

  ngOnInit() {
    setTimeout(() => {
      this.showLoading = false;
      this.loadingImage = true;
    }, 500);
    const d = new Date();
    const formatDate = moment(d).format('YYYY-MM-DD');

    const dateArry = formatDate.split('-');
    const setDate = {year: Number(dateArry[0]), month: Number(dateArry[1]), day: Number(dateArry[2])};
    this.sales = {
      customer: '',
      date: setDate,
      allCategory: '',
      subCategory: '',
      allProduct: '',
      subTotal: '',
      grandTotal: '',
      receivedAmount: '',
      due: '',
      paymentType: '',
      redeemLoyaltyPoints: 0,
      products: []
    };

    // initialize form with empty FormArray for products
    this.salesAddForm = new FormGroup({
      customer: new FormControl(''),
      date: new FormControl(''),
      allCategory: new FormControl('', Validators.compose([Validators.required])),
      allProduct: new FormControl('', Validators.compose([Validators.required])),
      subTotal: new FormControl(''),
      grandTotal: new FormControl(''),
      due: new FormControl(''),
      paymentType: new FormControl('', Validators.compose([Validators.required])),
      redeemLoyaltyPoints: new FormControl({disabled: true}),
      products: new FormArray([])
    });
    this.category();
    this.customer();
    this.paymentTypes();

  }

  category() {
    this.dataService.getAllCategory()
      .pipe().subscribe(data => {
      this.categoryList = (data as any).data.filter(c => !c.deleted);
    });
  }

  paymentTypes() {
    this.dataService.getPaymentTypes()
      .pipe().subscribe(data => {
      this.paymentTypeList = (data as any).data;
    });
  }

  categoryByProduct(key, val) {
    this.dataService.getCategoryByProduct(key, val)
      .pipe().subscribe(data => {
      this.productList = (data as any).data.filter(p => !p.deleted);
      this.sales.allProduct = '';
    });
  }

  customer() {
    this.dataService.getAllCustomer()
      .pipe().subscribe(data => {
      this.allCustomer = (data as any).data.filter(c => !c.deleted);
    });
  }

  selectCat(id) {
    if (id > 0) {
      this.categoryByProduct(1, id); //
    }
  }

  selectProduct(event) {
    if (event > 0) {
      this.dataService.getProductInfo(event)
        .pipe().subscribe(data => {
        const item = (data as any).data;
        const product = {
          id: item.id,
          serialNumber: item.serialNumber,
          name: item.name,
          quantity: 1,
          selling_price: item.price,
          total: null
        };
        this.sales.products.push(product);
        const control = this.salesAddForm.controls.products as FormArray;
        control.push(this.createFormGroupArray(product));
      });
      this.itemChange();
    }
  }

  itemChange() {
    let totalAmount = 0;
    for (const product of this.sales.products) {
      product.total = (product.selling_price * product.quantity);
      const num = Number(product.total);
      totalAmount += num;
    }
    setTimeout(() => {
      this.sales.subTotal = totalAmount;
    });
    this.changeGrandTotal();
  }

  changeGrandTotal() {
    setTimeout(() => {
      const subTotal = this.sales.subTotal;
      const total = subTotal + (subTotal / 100 * this.vat);
      this.sales.grandTotal = total.toFixed(2) - this.loyaltyPoints;
      this.amountChange();
    });
  }

  amountChange() {
    setTimeout(() => {
      const totalDue = this.sales.grandTotal - this.sales.receivedAmount;
      this.sales.due = totalDue.toFixed(2);
    });
  }

  createFormGroupArray(product) {
    return new FormGroup({
      serialNumber: new FormControl(product.serialNumber),
      name: new FormControl(product.name),
      quantity: new FormControl(product.quantity),
      selling_price: new FormControl(product.selling_price),
      total: new FormControl(product.total)
    });
  }

  deleteTableRow(index: number) {
    // delete payoff from both the model and the FormArray
    this.sales.products.splice(index, 1);
    const control = this.salesAddForm.controls.products as FormArray;
    control.removeAt(index);
    this.itemChange();
    this.changeGrandTotal();
  }

  createSales() {
    const request = {
      customerId: this.sales.customer,
      paymentType: this.sales.paymentType,
      redeemLoyaltyPoints: this.sales.redeemLoyaltyPoints,
      productAndQuantity: this.sales.products.reduce((previous, obj) => {
        previous[obj.id] = obj.quantity;
        return previous;
      }, {})
    };
    this.dataService.createSales(request)
      .pipe(map(data => (data as any).data))
      .subscribe(data => {
        this.alertService.success('Invoice Create successful', true);
        this.router.navigate(['sales-invoice-details/' + data.id]);
      }, error => {
        this.alertService.error(error);
      });
  }

  toggleLoyalty($event) {
    console.log($event);
    if ($event) {
      this.loyaltyPoints = this.selectedCustomer.loyaltyPoints;
    } else {
      this.loyaltyPoints = 0;
    }
    this.changeGrandTotal();
  }

  selectCustomer($event: any) {
    this.selectedCustomer = (this.allCustomer.filter(c => c.id == $event) as any)[0];
    const enableLoyaltyCheckbox = this.selectedCustomer && this.selectedCustomer.loyaltyPoints && this.selectedCustomer.loyaltyPoints > 0;
    if (enableLoyaltyCheckbox) {
      this.salesAddForm.get('redeemLoyaltyPoints').enable();
    } else {
      this.salesAddForm.get('redeemLoyaltyPoints').disable();
    }
  }
}

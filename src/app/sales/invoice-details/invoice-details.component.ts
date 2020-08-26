import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InvoiceDetailsService} from '../../_services/index';
// const printJS = require('print-js');
import * as printJS from 'print-js';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html'
})
export class InvoiceDetailsComponent implements OnInit {

  UrlParams: any;
  invoice: any;
  invoiceDetails: any = {
    settingData: '',
    name: '',
    email: '',
    phone: '',
    vatPercentage: '',
    invoiceNumber: '',
    orderProducts: '',
    createdAt: '',
    due: '',
    netAmount: '',
    grossAmount: '',
    paymentType: '',
    loyaltyDiscountAmount: '',
    totalPaid: ''
  };
  showLoading = true;
  loadingImage = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dataService: InvoiceDetailsService
  ) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.showLoading = false;
      this.loadingImage = true;
    }, 500);
    this.activatedRoute.params.subscribe(params => {
      this.UrlParams = params['id'];
    });

    this.dataService.getInvoiceDetails(this.UrlParams)
      .pipe().subscribe(data => {
      this.invoice = (data as any).data;
      const customer = this.invoice.customer;
      this.invoiceDetails = {
        settingData: JSON.parse(localStorage.getItem('setting')),
        name: customer ? customer.name : '-',
        email: customer ? customer.email : '-',
        phone: customer ? customer.phone : '-',
        vatPercentage: this.invoice.vatPercentage,
        invoiceNumber: this.invoice.invoiceNumber,
        createdAt: this.invoice.createdAt,
        due: this.invoice.due,
        currency: this.invoice.currency,
        netAmount: this.invoice.netAmount,
        grossAmount: this.invoice.grossAmount,
        orderProducts: this.invoice.orderProducts,
        paymentType: this.invoice.paymentType,
        totalPaid: this.invoice.totalPaid,
        loyaltyDiscountAmount: this.invoice.loyaltyDiscountAmount || '-',
      };

    });
  }

  printView() {
    printJS({
      printable: 'printJS-form',
      type: 'html',
      scanStyles: true,
      style: 'width:100%',
      ignoreElements: ['footers'],
      maxWidth: 1500,
      css: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
    });
    return false;
  }
}

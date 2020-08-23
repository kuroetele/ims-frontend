import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {SalesHistoryService, SettingService} from '../../_services/index';
import {appConfig} from '../../app.config';

class Sales {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: any;
  createdAt: string;
  due: number;
  grossAmount: number;
  currency: string;
  soldBy: string;
}

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html'
})
export class SalesHistoryComponent implements OnInit {
  dtOptions: DataTables.Settings = {}; //  DataTable
  dtTrigger = new Subject(); //  DataTable
  salesList: Sales[] = []; // Table Data list
  salesHistory: any = [];
  setting = {currency: ''};
  showloding = true;
  lodingImage = false;
  pdf = false;
  exl = false;
  print = false;

  constructor(
    public router: Router,
    private dataService: SalesHistoryService,
    private settingService: SettingService,
  ) {
    this.settingService.getSettingSubject()
      .subscribe(data => {
        this.setting = {currency: (data as any).currency};
      });
  }

  ngOnInit() {

    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);
    this.dataService.getAllsales()
      .pipe().subscribe(data => {
      this.salesList = (data as any).data;
      this.dtTrigger.next(); // Data Table
      this.pdf = true;
      this.exl = true;
      this.print = true;
    });
  }

  salesDetails(id) {
    this.router.navigate(['sales-invoice-details/' + id]);
  }

  takePayment(id) {
    this.router.navigate(['sales-take-payment/' + id]);
  }

  pdfExport() {
    window.open(appConfig.apiUrl + '/api/sales-history-list-pdf', '_blank');
  }

  xlExport() {
    window.open(appConfig.apiUrl + '/api/sales-history-list-excel', '_blank');
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertService, AppService, ReportService, SettingService} from '../_services';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {appConfig} from '../app.config';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Util} from '../_helpers/util';

const REPORT_COLUMNS = [0, 1, 2, 3, 4, 5, 6];

class Report {
  id: number;
  invoiceNumber: string;
  name: string;
  createdAt: string;
  customer: any;
  grossAmount: string;
  due: string;
  paymentType: string;
  createdBy: any;
}

@Component({
  selector: 'app-report',
  templateUrl: './sales-report.component.html'
})
export class SalesReportComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions = {
    dom: 'Bfrtip',
    buttons: [
      Util.excelButton(REPORT_COLUMNS, 'Sales Report'),
      Util.pdfButton(REPORT_COLUMNS, 'Sales Report')
    ]
  }; //  DataTable
  dtTrigger = new Subject(); //  DataTable

  reportList: Report[] = []; // Table Data list
  reportSearchForm: FormGroup;
  // report:any;
  d = new Date();
  formDate = moment(this.d).subtract('days', 30).format('YYYY-MM-DD');
  formDateArry = this.formDate.split('-');
  toDate = moment(this.d).format('YYYY-MM-DD');
  toDateArry = this.toDate.split('-');
  setDateFromDate = {year: Number(this.formDateArry[0]), month: Number(this.formDateArry[1]), day: Number(this.formDateArry[2])};
  setDateToDate = {year: Number(this.toDateArry[0]), month: Number(this.toDateArry[1]), day: Number(this.toDateArry[2])};
  report: any;
  setting = {currency: ''};
  pdf = false;
  exl = false;
  showloding = true;
  lodingImage = false;

  constructor(
    public router: Router,
    private dataService: ReportService,
    private alertService: AlertService,
    private appService: AppService,
    private parserFormatter: NgbDateParserFormatter,
    private settingService: SettingService
  ) {
  }

  ngOnInit() {

    this.settingService.getSettingSubject()
      .subscribe(data => {
        this.setting = {currency: (data as any).currency};
      });

    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);

    this.reportSearchForm = new FormGroup({
      fromdate: new FormControl(''),
      todate: new FormControl('')
    });
    this.report = {
      fromdate: this.setDateFromDate,
      todate: this.setDateToDate
    };

    this.getReport();
  }

  getReport() {
    const fromdate = this.parserFormatter.format(this.report.fromdate);
    const todate = this.parserFormatter.format(this.report.todate);
    const setReport = {fromdate, todate};
    // this.report.todate=todate;

    this.dataService.getReportData(setReport)
      .pipe().subscribe(data => {
      this.reportList = (data as any).data;
      // this.dtTrigger = new Subject(); //  DataTable
      this.dtTrigger.next(); // Data Table
      this.pdf = true;
      this.exl = true;
    }, error => {
      this.alertService.error(error);
    });
  }

  searchReport() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.getReport();
    });
  }

  pdfExport() {
    const fromdate = this.parserFormatter.format(this.report.fromdate);
    const todate = this.parserFormatter.format(this.report.todate);
    window.open(appConfig.apiUrl + '/api/sales-report-pdf?fromdate=' + fromdate + '&todate=' + todate, '_blank');
  }

  xlExport() {
    const fromdate = this.parserFormatter.format(this.report.fromdate);
    const todate = this.parserFormatter.format(this.report.todate);
    window.open(appConfig.apiUrl + '/api/sales-report-excel?fromdate=' + fromdate + '&todate=' + todate, '_blank');
  }

}

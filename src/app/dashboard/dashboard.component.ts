import {Component, OnInit} from '@angular/core';
import {AlertService, AppService, DashboardService, SettingService} from '../_services/index';
import {filter} from 'rxjs/operators';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: any[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  // dropdown buttons
  public status: { isopen } = {isopen: false};
  data: any;
  customerPayment = {};
  sales: any;
  payment: any;
  expense: any;
  setting = {currency: ''};
  totalCount = {
    product: '',
    order: '',
    customer: '',
    supplier: '',
    user: '',
    category: ''
  };
  lastProduct: any;
  topProducts: any;
  lastOrder: any;
  showloding = true;
  lodingImage = false;
  showUserCard = false;
  showProductCard = false;
  showCategoryCard = false;
  barChartData: any = [];

  constructor(
    private dataService: DashboardService,
    private settingService: SettingService,
    private alertService: AlertService,
    private appService: AppService
  ) {
    this.settingService.getSettingSubject()
      .subscribe(data => {
        this.setting = {currency: (data as any).currency};
      });
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit() {
    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);
    this.appService.getMenuObservable()
      .pipe(filter(data => data != null))
      .subscribe(data => {
        const routes = data
          .flatMap(x => x.subMenus)
          .flatMap(x => x.route)
          .concat(data.map(x => x.route));

        this.showUserCard = routes.indexOf('user') >= 0;
        this.showProductCard = routes.indexOf('product') >= 0;
        this.showCategoryCard = routes.indexOf('category') >= 0;
      });

    this.barChartData = [
      {data: [0], label: 'Sales'}
    ];
    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);
    this.dataService.getChartData()
      .pipe().subscribe(data => {
      // let dateArray = [];
      let salesAmountArray = [];
      let sales = (data as any).data;
      for (let i = 0; i < sales.length; ++i) {
        this.barChartLabels.push(sales[i].year);
        salesAmountArray.push(sales[i].amount);
      }

      this.barChartData = [
        {data: salesAmountArray, label: 'Sales'}
      ];
    });


    this.dataService.totalCount()
      .pipe().subscribe(data => {
      data = data as any;
      this.totalCount = {
        product: (data as any).data.products,
        user: (data as any).data.users,
        order: (data as any).data.orders,
        supplier: '0',
        customer: (data as any).data.customers,
        category: (data as any).data.categories,
      };
    });


    this.dataService.sumAllData()
      .pipe().subscribe(data => {
      data = (data as any).data;
      this.sales = data['current-month-total-sales'];
    });

    this.dataService.getLastProduct()
      .subscribe(data => {
        this.lastProduct = (data as any).data;
      });

    this.dataService.getTopSellingProductsForCurrentMonth()
      .subscribe(data => {
        this.topProducts = (data as any).data;
      });

  }


}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) {
  }

  totalCount() {
    return this.http.get('/api/dashboard/total-counts');
  }

  getChartData() {
    return this.http.get('/api/orders/yearly-sum');
  }

  sumAllData() {
    return this.http.get('/api/dashboard/total-sums');
  }

  getLastProduct() {
    return this.http.get('/api/products/low-stock');
  }

  getTopSellingProductsForCurrentMonth() {
    return this.http.get('/api/products/top-selling-current-month');
  }
}

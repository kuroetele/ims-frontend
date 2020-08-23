import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SalesService {

  constructor(private http: HttpClient) {
  }

  getAllCustomer() {
    return this.http.get('/api/customers');
  }

  getCustomerDiscount(id) {
    return this.http.post('/api/get-customer-by-discount', {id: id});
  }

  getAllCategory() {
    return this.http.get('/api/categories');
  }

  getPaymentTypes() {
    return this.http.get('/api/orders/payment-types');
  }


  getCategoryByProduct(type, id) {

    return this.http.get('/api/products/categories/' + id);
  }

  getProductInfo(id) {
    return this.http.get('/api/products/' + id);
  }

  createSales(data) {
    return this.http.post('/api/orders', data);
  }

}

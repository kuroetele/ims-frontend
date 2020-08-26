import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Util} from '../_helpers/util';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) {
  }

  save(data) {
    return this.http.post('/api/products', Util.formDataToJSON(data));
  }

  getAllProduct() {
    return this.http.get('/api/products');
  }

  getProduct(id) {
    return this.http.get('/api/products/' + id);
  }

  getCategory() {
    return this.http.get('/api/categories');
  }

  productUpdate(data) {
    data = Util.formDataToJSON(data);
    return this.http.put('/api/products/' + data.id, data);
  }

  getProductInfo(id) {
    return this.http.get('/api/products/' + id);
  }

  getTopSellingProducts() {
    return this.http.get('/api/products/top-selling');
  }

}

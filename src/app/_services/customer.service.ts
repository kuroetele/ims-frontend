import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Util} from '../_helpers/util';


@Injectable()
export class CustomerService {

  constructor(private http: HttpClient) {
  }


  save(data) {
    return this.http.post('/api/customers', Util.formDataToJSON(data));
  }

  getAllCustomer() {
    return this.http.get('/api/customers');
  }

  getCustomer(id) {

    return this.http.get('/api/customers/' + id);
  }

  customerUpdate(formData) {
    const data = Util.formDataToJSON(formData);
    return this.http.put('/api/customers/' + data.id, data);
  }

  getCustomerInfo(id) {
    return this.http.get('/api/orders/customers/' + id);
  }

}

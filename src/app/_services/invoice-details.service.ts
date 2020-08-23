import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class InvoiceDetailsService {

  constructor(private http: HttpClient) {
  }

  getInvoiceDetails(id) {
    return this.http.get('/api/orders/' + id);
  }


}

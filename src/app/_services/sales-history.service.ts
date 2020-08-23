import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SalesHistoryService {

  constructor(private http: HttpClient) {
  }

  getAllsales() {
    return this.http.get('/api/orders');
  }


}

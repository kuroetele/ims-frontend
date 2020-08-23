import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class ReportService {

  constructor(private http: HttpClient) {
  }

  getReportData(data) {
    let params = new HttpParams();
    params = params.append('startDate', data.fromdate);
    params = params.append('endDate', data.todate);
    return this.http.get('/api/orders', {params});
  }
}

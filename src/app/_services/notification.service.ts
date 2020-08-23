import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  send(data) {
    return this.http.post('/api/sent-notification', data);
  }
}

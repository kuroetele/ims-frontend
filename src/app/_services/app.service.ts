import {Injectable} from '@angular/core';
// import {  Http,RequestOptions } from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {Util} from '../_helpers/util';


@Injectable({providedIn: 'root'})
export class AppService {
  private menu = new BehaviorSubject(null);
  private profileSubject = new Subject();


  constructor(private http: HttpClient) {

  }

  checkLogin(token) {
    const bodyString = token; // Stringify payload
    // let headers      = new HttpHeaders({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer' + token});
    const options = {headers: httpHeaders};
    return this.http.get('/api/users/me', options);

  }

  profileUpdate(formData) {
    const data = Util.formDataToJSON(formData);
    return this.http.put('/api/users/me', data);
  }

  updatePassword(data) {
    return this.http.post('/api/update-password', data);
  }

  fetchMenu() {
    return this.http.get('/api/menus');
  }

  getMenuObservable() {
    return this.menu;
  }

  getProfileObservable() {
    return this.profileSubject;
  }

  setMenu(data: any) {
    this.menu.next(data);
  }

  emitProfileData(profileDate: any) {
    this.profileSubject.next(profileDate);
  }
}

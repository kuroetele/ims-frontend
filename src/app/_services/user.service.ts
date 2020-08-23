import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Util} from '../_helpers/util';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  save(formData) {
    const data = Util.formDataToJSON(formData);
    return this.http.post('/api/users', data);

  }

  getAllUsers() {
    return this.http.get('/api/users');
  }

  getUser(id) {
    return this.http.get('/api/users/' + id);
  }

  userUpdate(formData) {
    const data = Util.formDataToJSON(formData);
    return this.http.put('/api/users/' + data.id, data);
  }

  getUserRoles() {
    return this.http.get('/api/users/roles');
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CategoryService {

  getToken = window.localStorage.getItem('token');

  constructor(private http: HttpClient) {
  }

  save(data) {
    return this.http.post('/api/categories', data);
  }

  getAllCategory() {
    return this.http.get('/api/categories');
  }

  getCategory(id) {
    return this.http.get('/api/categories/' + id);
  }

  categoryUpdate(data) {
    return this.http.put('/api/categories/' + data.id, data);
  }

  categoryDelete(id) {
    return this.http.delete('/api/categories/' + id);
  }
}

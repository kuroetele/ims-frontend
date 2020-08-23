import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Util} from '../_helpers/util';
import {ReplaySubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SettingService {

  private settingSubject = new ReplaySubject();

  constructor(private http: HttpClient) {
  }

  fetchSettingData() {
    return this.http.get('/api/settings/default');
  }

  settingUpdate(formDatata) {
    const data = Util.formDataToJSON(formDatata);
    return this.http.post('/api/settings/' + data.id, data);
  }

  getSettingSubject() {
    return this.settingSubject;
  }

  emitSettingData(settingData: any) {
    this.settingSubject.next(settingData);
  }

}

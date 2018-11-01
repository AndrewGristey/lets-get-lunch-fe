import { Injectable, EventEmitter, Output } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { LocalStorageService } from 'ngx-webstorage';

import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthService {
  @Output() loggedIn: EventEmitter<boolean>;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.loggedIn = new EventEmitter();
  }

  signup(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/users', credentials)
      .mergeMap(res => this.login(credentials));
  }

  login(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/sessions', credentials)
      .map((res: any) => {
        this.localStorage.store('Authorization', res.token);
        this.loggedIn.emit(true);
        return res;
      });
  }

  logout() {
    this.localStorage.clear('Authorization');
    this.loggedIn.emit(false);
  }
    

  isLoggedIn() {
    return tokenNotExpired('ng2-webstorage|authorization');
  }

}

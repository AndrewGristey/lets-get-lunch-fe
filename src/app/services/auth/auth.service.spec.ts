import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { LocalStorageService } from 'ngx-webstorage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


describe('AuthService', () => {
  let authService: AuthService,
      http: HttpTestingController,
      localStorage: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, LocalStorageService]
    });

    authService = TestBed.get(AuthService);
    http = TestBed.get(HttpTestingController);
    localStorage = TestBed.get(LocalStorageService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should return a token with a valid username and password', () => {
      const user = { 'username': 'myUser', 'password': 'password' };
      const signupResponse = {
          "__v": 0,
          "username": "myUser",
          "password": "$2a$10$PtkVaEWCWcAB1xmBnhNk5ub.iHNxRHB5LGrVjuB0hUh.07Sm9L7FW",
          "_id": "5aee7defbf50db41e4441d5d",
          "dietPreferences": []
      }
      const loginResponse = { 'token': 's3cr3tt0ken' };
      let response;

      authService.signup(user).subscribe(res => {
        response = res;
      });
      spyOn(authService, 'login').and.callFake(() => Observable.of(loginResponse));

      http.expectOne('http://localhost:8080/api/users').flush(signupResponse);
      expect(response).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalled();
      http.verify();
    });

    it('should return an error for an invalid user object', () => {
      const user = { username: 'myUser', password: 'pswd' };
      const signupResponse = 'Your password must be at least 5 characters long.';
      let errorResponse;
  
      authService.signup(user).subscribe(res => {}, err => {
        errorResponse = err;
      });
  
      http
        .expectOne('http://localhost:8080/api/users')
        .flush({message: signupResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('login', () => {
    it('should return a token with a valid username and password', () => {
      const user = { 'username': 'myUser', 'password': 'password' };
      const loginResponse = { 'token': 's3cr3tt0ken' };
      let response;
  
      authService.login(user).subscribe(res => {
        response = res;
      });
      spyOn(authService, 'login').and.callFake(() => Observable.of(loginResponse));
  
      http.expectOne('http://localhost:8080/api/sessions').flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.retrieve('Authorization')).toEqual('s3cr3tt0ken');
      http.verify();
    });
  });
});

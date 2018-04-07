import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  //domain ="http://localhost:8080";
  domain = environment.domain;
  authToken;
  user;
  options;

  constructor( private http: Http ) { 

  }

  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  checkUsername (username) {
    return this.http.get(this.domain + '/authentication/checkusername/' + username).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkemail/' + email).map(res => res.json());
  }

  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  getProfile() {
    this.createAuthenticationHeaders(); // Create headers before sending to API
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }
  
  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    localStorage.clear(); // Clear local storage
  }
  
  storeUserData(token, user) {
    localStorage.setItem('token' ,token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getPublicProfile(userId) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/publicProfile/'+ userId, this.options).map(res => res.json());
  }
  
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiURL: string = "/api";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/authentication/login`, { username, password }, this.httpOptions)
      .pipe(tap(user => {
        console.log(user);
        this.storeUser(user);
        this.startRefreshTokenTimer();
        

      }));
  }

  logout() {
    this.http.post<any>(`${this.apiURL}/authentication/logout`, {}, this.httpOptions).subscribe();
    this.stopRefreshTokenTimer();
    this.removeUser();
    this.router.navigate(['/login']);
  }


  storeUser(user: any) {
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
  }


  refreshToken() {
    return this.http.post<any>(`${this.apiURL}/authentication/refresh_token`, {},  this.httpOptions)
      .pipe(tap((res) => {
        const user = this.loadUser();
        if(user == null)
        return;
        user.accessToken = res.accessToken;
        this.storeUser(user);
        this.startRefreshTokenTimer();

      }));
  }
  removeUser() {
    localStorage.removeItem("user");
  }
  private refreshTokenTimeout!: ReturnType<typeof setTimeout>;
  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token´
    const user= this.loadUser();
    if (user == null)
      return;
    const jwtToken = JSON.parse(atob(user.accessToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(0);
    expires.setUTCSeconds(jwtToken.exp);
    const now =  new Date(Date.now())
    const timeout = expires.getTime() - now.getTime()-(60*1000); 
    console.log( now.toLocaleTimeString()) 
    console.log( now.toString()) 
    console.log(expires.toLocaleTimeString());
    console.log( expires.toString()) 
    console.log(timeout)
    this.refreshTokenTimeout = setTimeout(() => {this.refreshToken().subscribe()
    }, timeout);
  }

  loadUser():User|null {
    const user: string | null = localStorage.getItem("user")
    if (user == null)
      return null;
    return JSON.parse(user);
  }
  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
}
}

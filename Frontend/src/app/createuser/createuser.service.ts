import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateuserService {
  private createuserURL: string = "/api/authentication/createuser";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  createUser(username: string, password: string, role: string): Observable<any>{
    return this.http.post<any>(`${this.createuserURL}/add`, {username, password, role}, this.httpOptions);
  }
}

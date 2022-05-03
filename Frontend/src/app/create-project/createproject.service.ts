import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {
  private createprojectURL: string = "/api/authentication/createproject";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  createProject(username: string, acronym: string, startDate: Date, finalDate: Date): Observable<any>{
    return this.http.post<any>(`${this.createprojectURL}/add`, {username, acronym, startDate, finalDate}, this.httpOptions);
  }
}

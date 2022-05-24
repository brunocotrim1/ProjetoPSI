import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {
  private createprojectURL: string = "/api";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  createProject(username: string, acronym: string, beginDate: Date, endDate: any): Observable<any>{
    return this.http.post<any>(`${this.createprojectURL}/addproject`, {username, acronym, beginDate, endDate}, this.httpOptions);
  }
}

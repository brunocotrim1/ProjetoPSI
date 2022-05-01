import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkprojectstoteamsService {
  private linkprojectstoteamsURL: string = "/api/authentication/linkprojectstoteams";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  getProjects(): Observable<any>{
    return this.http.get<any>(`/api/getprojects`, this.httpOptions);
  }

  getTeams(): Observable<any>{
    return this.http.get<any>(`/api/getteams`, this.httpOptions);
  }
  
}

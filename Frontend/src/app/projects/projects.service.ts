import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectsURL: string = "/api";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  getProjects(): Observable<any>{
    return this.http.get<any>(`${this.projectsURL}/getprojects`, this.httpOptions);
  }

  getTeam(id : string): Observable<any>{
    return this.http.get<any>(`${this.projectsURL}/getteam/${id}`, this.httpOptions);
  }

  getTeams(): Observable<any>{
    return this.http.get<any>(`${this.projectsURL}/getteams`, this.httpOptions);
  }

  updateTeam(): Observable<any>{
    return this.http.put<any>(`${this.projectsURL}/updateproject`, this.httpOptions);
  }
  
}

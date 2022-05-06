import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class ManageTeamsService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  getTeams(): Observable<any>{
    return this.http.get<any>(`/api/getteams`, this.httpOptions);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<any>(`/api/getusers/`, this.httpOptions);
  }

  updateTeam(id : string, members : User[]): Observable<any>{
    return this.http.put<any>(`/api/updateteam/${id}`, {members}, this.httpOptions);
  }
}

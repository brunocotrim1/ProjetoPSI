import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class ScheduleReunionService {
  private schedulereunionURL: string = "/api/authentication/schedulereunion";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeUser()
  }

  // GET /api/getallusers
  getAllUsers() {
    const url = `/api/getusers`;
    return this.http.get<any>(url, this.httpOptions);
  }

  scheduleReunion(reunion: any): Observable<any> {
    const url = `/api/getusers`;
    return this.http.post<any>(url, this.httpOptions);
  }
}

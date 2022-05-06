import { Injectable } from '@angular/core';
import { User } from '../User';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CreateTeamService {
  private createTeamURL: string = "/api/teams";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private router: Router,
    private http: HttpClient) { }

  // GET /api/getallusers
  getAllUsers() {
    
    const url = `/api/getusers`;
    console.log("FETCHED ALL USERS")
    return this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError)
      );
    }


  // GET /api/getteamusers/:teamname
  getUsersFromTeamName(teamName: String) {
    
    
    const url = `/api/getteamusers/${teamName}`;
    return this.http.get<User[]>(url).pipe(
      catchError(this.handleError)
    );
      
  }


  // GET /api/user/un/:username
  getUserByName(username: String) {
    if (!username.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    
    const url = `/api/user/un/${username}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  // POST /api/teams/add
  saveTeam(team: any): Observable<any> {

    return this.http.post<any>(`${this.createTeamURL}/add`, {team}, this.httpOptions);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
 }

}

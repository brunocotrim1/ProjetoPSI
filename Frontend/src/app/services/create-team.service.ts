import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { User } from '../User';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
=======
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../User';
>>>>>>> 48a558f7e528f113f70bfd623e9f57d61a3ef5c5

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


<<<<<<< HEAD
  // GET /api/getteamusers/:teamname
  getUsersFromTeamName(teamName: String) {
    if (!teamName.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    
    const url = `/api/getteamusers/?teamname=${teamName}`;
    return this.http.get<User[]>(url).pipe(
      catchError(this.handleError)
    );
      
  }
      
  // GET /api/user/:id
  getUserById(id: String) {
    if (!id.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    
    const url = `/api/user/id=${id}`;
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

=======
  getMembers(): User[] {
    
    const fake_member_1: User = {
      id: "1",
      username: "Grepolian",
      accessToken: '',
      refresh_token: '',
      role: ''
    };
    const fake_member_2: User = {
      id: "2",
      username: "Beans",
      accessToken: '',
      refresh_token: '',
      role: ''
    };
    const fake_member_3: User = {
      id: "3",
      username: "Endo",
      accessToken: '',
      refresh_token: '',
      role: ''
    };
    const fake_member_4: User = {
      id: "4",
      username: "Belarmino",
      accessToken: '',
      refresh_token: '',
      role: ''
    };
    const fake_member_5: User = {
      id: "5",
      username: "Siuuu",
      accessToken: '',
      refresh_token: '',
      role: ''
    };
    return [fake_member_1, fake_member_2, fake_member_3, fake_member_4, fake_member_5]
  }

  getMemberById(id: String): User {
    let everyMember = this.getMembers() as User[];
    for (let i = 0; i < everyMember.length; i++) {
      if (everyMember[i].id == id) {
        return everyMember[i]
      } 
    }
    return {} as User
  }
  
  saveTeam(team_name: String, members: User[]): Observable<any> {
    return this.http.post<any>(`${this.createTeamURL}/add`, {team_name, members}, this.httpOptions);
  }
>>>>>>> 48a558f7e528f113f70bfd623e9f57d61a3ef5c5
}

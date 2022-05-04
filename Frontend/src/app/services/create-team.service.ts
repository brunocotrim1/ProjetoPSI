import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class CreateTeamService {
  private createTeamURL: string = "/api/authentication/createteam";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private router: Router,
    private http: HttpClient) { }


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
}

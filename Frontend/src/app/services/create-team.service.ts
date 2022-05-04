import { Injectable } from '@angular/core';
import { Member } from '../Member';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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


  getMembers(): Member[] {
    
    const fake_member_1: Member = {
      id: "1",
      username: "Grepolian"
    };
    const fake_member_2: Member = {
      id: "2",
      username: "Beans"
    };
    const fake_member_3: Member = {
      id: "3",
      username: "Endo"
    };
    const fake_member_4: Member = {
      id: "4",
      username: "Belarmino"
    };
    const fake_member_5: Member = {
      id: "5",
      username: "Siuuu"
    };
    return [fake_member_1, fake_member_2, fake_member_3, fake_member_4, fake_member_5]
  }

  getMemberById(id: String): Member {
    let everyMember = this.getMembers() as Member[];
    for (let i = 0; i < everyMember.length; i++) {
      if (everyMember[i].id == id) {
        return everyMember[i]
      } 
    }
    return {} as Member
  }


  
  saveTeam(team_name: String, members: Member[]): Observable<any> {
    return this.http.post<any>(`${this.createTeamURL}/add`, {team_name, members}, this.httpOptions);
  }


}

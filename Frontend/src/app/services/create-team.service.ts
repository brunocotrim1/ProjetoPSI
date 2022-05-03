import { Injectable } from '@angular/core';
import { Team } from '../Team';
import { Member } from '../Member';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateTeamService {
  private createuserURL: string = "/api/authentication/createuser";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor() { }


  validName(name: string): boolean {
    // CHECK COM REGEX
    // apenas alfanumericos, pelo menos 4 chars e unico
    return false
  }

  
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

  saveTeam(team: Team): void {

  }


}

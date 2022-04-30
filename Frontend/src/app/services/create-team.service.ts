import { Injectable } from '@angular/core';
import { Team } from '../Team';
import { Member } from '../Member';

@Injectable({
  providedIn: 'root'
})
export class CreateTeamService {

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
    return [fake_member_1, fake_member_2, fake_member_3]
  }

  saveTeam(team: Team): void {

  }


}

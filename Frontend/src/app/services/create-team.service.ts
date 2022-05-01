import { Injectable } from '@angular/core';
import { Team } from '../Team';

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

  


  saveTeam(team: Team): void {

  }


}

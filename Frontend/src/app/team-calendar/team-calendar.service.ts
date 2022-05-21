import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Team } from '../Team';
import { User } from '../User';
import { Task } from '../Task';
@Injectable({
  providedIn: 'root'
})
export class TeamCalendarService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private apiURL: string = "/api";
  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiURL}/getteams`, this.httpOptions);
  }
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiURL}/allTasks`, this.httpOptions);
  }
}

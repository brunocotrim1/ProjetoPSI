import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Team } from '../Team';
import { User } from '../User';
import { Task } from '../Task';
import { Unavailability } from '../Unavailabilty';
import { Reunion } from '../Reunion';
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
  getUnavailables(): Observable<Unavailability[]> {
    return this.http.get<Unavailability[]>(`${this.apiURL}/unavailables`, this.httpOptions);
  }
  getReunions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/getreunions`, this.httpOptions);
  }
}

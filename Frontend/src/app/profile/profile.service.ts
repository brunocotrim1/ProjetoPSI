import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reunion } from '../Reunion';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private apiURL: string = "/api";
  ngOnInit(): void {
  }
  getTaskList(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/tasks`, this.httpOptions);
  }

  getReunions(): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiURL}/getreunions`, this.httpOptions);
  }


  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }
}

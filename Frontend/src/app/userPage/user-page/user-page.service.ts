import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {Task} from '../../Task';
import { User } from '../../User';
@Injectable({
  providedIn: 'root'
})
export class UserPageService {
  private apiURL: string = "/api";
  constructor(private http: HttpClient,private authenticationService: AuthenticationService) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  getUser(userAssociated:string):  Observable<User> {
    return this.http.get<User>(`${this.apiURL}/user/${userAssociated}`, this.httpOptions);
  }
  getTaskList(userAssociated:string): Observable<Task[]> {
    return this.http.get<any>(`${this.apiURL}/tasks/fromuser/${userAssociated}`, this.httpOptions);
  }
  getUserLogged(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { } 
  
  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }

}

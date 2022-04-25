import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  getUser(): User | undefined {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return undefined
  }
}

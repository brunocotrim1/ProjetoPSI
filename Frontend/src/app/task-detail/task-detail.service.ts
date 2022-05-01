import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { Task } from '../Task';
@Injectable({
  providedIn: 'root'
})
export class TaskDetailService {


  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }

  getUserById(userAssociated: string): Observable<User> {
    return this.http.get<any>(`/api/user/${userAssociated}`, this.httpOptions);
  }
  getTaskDetail(id: string): Observable<Task> {
    return this.http.get<any>(`/api/task/${id}`, this.httpOptions);
  }

  saveTask(task: any): Observable<any> {
    return this.http.post<any>('/api/saveTask', task, this.httpOptions);
  }

}

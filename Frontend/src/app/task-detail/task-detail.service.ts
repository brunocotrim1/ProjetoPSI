import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { Task } from '../Task';
import { Project } from '../Project';
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
  getUsers(): Observable<User[]> {
    return this.http.get<any>(`/api/getusers/`, this.httpOptions);
  }
  saveTask(task: any): Observable<any> {
    return this.http.post<any>('/api/saveTask', task, this.httpOptions);
  }
  updateTaskToProject(task: Task, project: Project): Observable<any> {
    return this.http.put<any>('/api/updatetasktoproject', {task,project}, this.httpOptions);
  }
  getProjects(): Observable<any>{
    return this.http.get<any>(`/api/getprojects`, this.httpOptions);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/User';
import { Task } from 'src/app/Task';
@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {

  tasks = [] as Task[]
  error = ''
  user = {} as User;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  private apiURL: string = "/api";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  ngOnInit(): void {
    this.user = this.getUser();
    this.getTaskList().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log(tasks)
        console.log(this.tasks)
      },
      error: error => {
        this.error = error;
      }
    });
  }


  getTaskList(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/allTasks`, this.httpOptions);
  }
  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }
}

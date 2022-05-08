import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
  constructor(private router: Router,private http: HttpClient, private authenticationService: AuthenticationService) { }
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

  checkIfNoTasks(){
    return Object.keys(this.tasks).length === 0;
  }

  onDeleteTask(curtask: Task){
    console.log(this.tasks)
    this.tasks = this.tasks.filter((task) => task._id != curtask._id);
    console.log(this.tasks)
    this.deleteTask(curtask._id).subscribe({
      next: () => {
        console.log(this.tasks)
      },
      error: error => {
        this.error = error;
      }
    });
  }

  deleteTask(taskID: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/deleteTask/${taskID}`, this.httpOptions);
  }

  navigateToDetails(id: string){
    this.router.navigate(['/taskDetail/'+id]);
  }

  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }
}

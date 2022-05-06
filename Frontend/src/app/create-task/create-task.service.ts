import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskService {
  private createtaskURL: string = "/api/createtask";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private router: Router,
    private http: HttpClient) {
    //  this.removeTask()
  }

  createTask(taskname : String, priority : String, percentage : number, userID : any): Observable<any>{
    console.log("called service")
    return this.http.post<any>(`${this.createtaskURL}/add`, {taskname, priority, percentage, userID}, this.httpOptions);
  }
}
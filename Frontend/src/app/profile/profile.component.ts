import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../User';
import { ProfileService } from './profile.service';
import { Task } from '../Task';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = {} as User;
  error:string | undefined;
  tasks: Task[] = [];
  constructor(private profileService: ProfileService, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.profileService.getTaskList().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log(this.tasks)
      },
      error: error => {
        this.error = error;
      }
    });
    this.user = this.profileService.getUser();
    if (this.user == undefined)
      this.router.navigate(["/"]);
  }

}

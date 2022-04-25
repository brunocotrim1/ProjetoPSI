import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../User';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  error:string | undefined;
  tasks: Task[] | undefined;
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

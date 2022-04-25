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
  constructor(private profileService: ProfileService, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.profileService.getTaskList().subscribe({
      next: (tasks) => {
        console.log(tasks)
      },
      error: error => {
        console.log(error);
      }
    });
    this.user = this.profileService.getUser();
    if (this.user == undefined)
      this.router.navigate(["/"]);
  }

}

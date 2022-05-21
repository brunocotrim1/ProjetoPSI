import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Team } from '../Team';
import { User } from '../User';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {


  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  user =  {} as User;
  error = "";
  message = ""
  teams = [] as Team[];
  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
    this.getTeams();
  }


  getTeams()  {
    this.http.get<Team[]>('/api/getteams').subscribe({
      next: (msg) => {
        this.error='';
        this.teams = msg;
        console.log(msg)
      },
      error: error => {
        this.message = '';
        this.error = error;
      }
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  user =  {} as User;
  error = "";
  message = ""
  users = [] as User[];
  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
    this.getUsers();
  }


  getUsers()  {
    this.http.get<User[]>('/api/getusers').subscribe({
      next: (msg) => {
        this.error='';
        this.users = msg;
        console.log(msg)
      },
      error: error => {
        this.message = '';
        this.error = error;
      }
    });
  }
}

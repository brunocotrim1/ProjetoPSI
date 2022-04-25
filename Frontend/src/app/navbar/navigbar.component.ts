import { Component, Input, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';

@Component({
  selector: 'app-navigbar',
  templateUrl: './navigbar.component.html',
  styleUrls: ['./navigbar.component.scss']
})

export class NavigbarComponent implements OnInit {

  user = {} as User;

  @Input()
    currentComponent!: string;

  @Input()
    username!: string;
    
  @Input()
    userrole!: string;
  
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }
  
  logout() {
    this.authenticationService.logout();
  }

}
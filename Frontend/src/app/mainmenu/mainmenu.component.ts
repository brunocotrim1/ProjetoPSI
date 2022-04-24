import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})

export class MainMenuComponent implements OnInit {

  user = {} as User;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }
  
  logout() {
    this.authenticationService.logout();
  }

}
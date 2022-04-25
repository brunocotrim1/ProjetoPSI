import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';


@Component({
  selector: 'app-criar-equipas',
  templateUrl: './criar-equipas.component.html',
  styleUrls: ['./criar-equipas.component.scss']
})
export class CriarEquipasComponent implements OnInit {

  user = {} as User;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }
  
  logout() {
    this.authenticationService.logout();
  }

}

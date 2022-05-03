import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';


@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.scss']
})
export class CreateTeamsComponent implements OnInit {

  user = {} as User;
  projectForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)])
    }
  );
  submitted = false;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }

  get f() { 
    return this.projectForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }
  }
  logout() {
    this.authenticationService.logout();
  }

}

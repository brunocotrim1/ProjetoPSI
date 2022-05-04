import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateTeamService } from '../services/create-team.service';


@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.scss']
})
export class CreateTeamsComponent implements OnInit {

  user = {} as User;
  teamForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)])
    }
  );
  submitted = false;
  constructor(private createteamservice: CreateTeamService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }

  get f() { 
    return this.teamForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.teamForm.invalid) {
      return;
    }
    // this.createteamservice.saveTeam(this.f["name"].value, this.f["dropdown"])
    //   .subscribe({
    //     next: () => {
    //       // this.returnmessage = "New team created!";
    //       // this.loading = false;
    //     },
    //     error: error => {
    //       // this.error = error;
    //       // this.loading = false;

    //     }
    //   });
  }
  logout() {
    this.authenticationService.logout();
  }

}

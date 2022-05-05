
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateTeamService } from '../services/create-team.service';
import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.scss']
})
export class CreateTeamsComponent implements OnInit {
  loading = false;
  user = {} as User;



  dropdownList: any[] = [];
  

  fillInDropdown(typeobject : string) {
    if(typeobject === "Project") {
      //ir fazer getallprojects do service do project
      

    } else if(typeobject === "Team") {
      this.dropdownList = [];
    
      this.createteamservice.getAllUsers().subscribe(
          userList => {
              
            this.dropdownList = [...userList].map(x => x.username);
              
          }
        );

      }
      
    } 



    dropdownSettings: any = {};
    


    ageRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
      console.log(control.value.length)
      if (control.value.length == 0) {
        console.log("entered if")
          return { 'dropdown-error': true };
      }
      return null;
    }


    teamForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9]+$/i)]),
        dropdown: new FormControl('', [this.ageRangeValidator])
      }
    );
  
  submitted = false;
  constructor(private createteamservice: CreateTeamService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
    this.fillInDropdown("Team") 
      
      this.dropdownSettings = {
        idField: 'item_id' ,
        textField: 'item_text',
      };
  }

  get f() { 
    return this.teamForm.controls; 
  }
  
  onSubmit() {
    //console.log("entrou no on submit")
    this.submitted = true;
    //console.log(this.teamForm.invalid)
    //console.log(this.f['dropdown'].errors)
    if (this.f['name'].errors) {
      // console.log(this.f['name'].errors['required'])
      // console.log(this.f['name'].errors['minlength'])
      // console.log(this.f['name'].errors['pattern'])
    }
    
    if (this.teamForm.invalid) {
      // console.log("invalid")
      return;
    }
    this.createteamservice.saveTeam({name: this.f["name"], members: ["A", "B", "C"]}).subscribe({
      next: () => {
        //this.returnmessage = "New user created!";
        this.loading = false;
      },
      error: error => {
        //this.error = error;
        this.loading = false;
      }
    });
    
    //   });
  }
  

}

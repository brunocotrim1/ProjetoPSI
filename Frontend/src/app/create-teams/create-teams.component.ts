
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateTeamService } from '../services/create-team.service';
import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { tap } from 'rxjs/operators';



@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.scss']
})
export class CreateTeamsComponent implements OnInit {

  loading = false;
  user = {} as User;
  dropdownList: any[] = [];
  dropdownUsers: any[] = [];
  returnmessage = '';
  success = false;

  fillInDropdown(typeobject: string) {
    if (typeobject === "Project") {
      //ir fazer getallprojects do service do project
    } else if (typeobject === "Team") {
      this.dropdownList = [];
      this.createteamservice.getAllUsers().subscribe(
        userList => {
          this.dropdownList = [...userList].map(x => x.username);
          this.dropdownUsers = userList as any[];
        }
      );
    }
  }

  dropdownSettings: any = {};

  DropdownValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value.length == 0) {
      return { 'dropdown-error': true };
    }
    return null;
  }

  teamForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)]),
      dropdown: new FormControl('', )
    }
  );

  submitted = false;
  constructor(private createteamservice: CreateTeamService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
    this.fillInDropdown("Team")

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    };

  }

  get f() {
    return this.teamForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    //console.log(this.teamForm.invalid)

    if (this.teamForm.invalid) {
      // console.log("invalid")
      return;
    }
    const fetchUsers = () => {
      return this.dropdownUsers.filter(x => this.f["dropdown"].value.includes(x.username)).map((x: any) => x.id)
    }

    this.createteamservice.saveTeam({ name: this.f["name"].value, members: fetchUsers() }).subscribe({
      next: () => {

        this.success = true
        this.returnmessage = 'Team created!';
        this.loading = false;
      },
      error: (error) => {

        this.success = false
        this.returnmessage = error;
        this.loading = false;
      }
    })
  }
}

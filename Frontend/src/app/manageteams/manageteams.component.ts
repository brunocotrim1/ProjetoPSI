import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { ManageTeamsService } from '../services/manage-teams.service';
import Validation from '../createuser/validation';
import { Team } from '../Team';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manageteams',
  templateUrl: './manageteams.component.html',
  styleUrls: ['./manageteams.component.scss']
})
export class ManageteamsComponent implements OnInit {

  user = {} as User;
  findUser: boolean = false;
  error = ""
  message = ""
  username = ""
  data: Array<any> = [];
  dropdownSettings: any = {};
  allusers = [] as User[];
  public disabled = false;

  listOfTeams = [] as Team[];
  currTeam = {} as Team;

  teamUser = new FormGroup(
    {
      team: new FormControl('', [Validators.required]),
      usersSelected: new FormControl('',),
    }
  );


  //nameFirstTeam : number = 5;

  constructor(private authenticationService: AuthenticationService,
    private manageteamsservice: ManageTeamsService, private router: Router) {

  }

  ngOnInit(): void {
    //console.log(this.manageteamsservice.getTeam1);
    this.user = this.authenticationService.loadUser()!;
    this.manageteamsservice.getTeams()
      .subscribe({
        next: (teams) => {
          this.listOfTeams = teams;
          console.log("Teams getted : " + this.listOfTeams.length)
        },
        error: error => {
          this.listOfTeams = {} as Team[];
          console.log("Teams not getted : " + this.listOfTeams.length)
        }
      });
    this.manageteamsservice.getUsers()
      .subscribe({
        next: (users) => {
          console.log(users);
          this.allusers = users;
          console.log(this.allusers)
          this.data = []
          for (let i = 0; i < this.allusers.length; i++) {
            this.data.push({ item_id: i, item_text: this.allusers[i].username });
          }
        },
        error: error => {
          this.allusers = {} as User[];
          console.log(this.allusers);
        }
      });
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
    return this.teamUser.controls;
  }
  teamSelected() {
    return this.f["team"].value
  }

  onChange() {
    // this.f['usersform'].setValue([])
    if (this.f['usersSelected'].value)
      this.f['usersSelected'].setValue([])
    let selectedItems: any[] = [];
    for (let i = 0; i < this.f["team"].value.members.length; i++) {
      selectedItems.push({ item_id: i, item_text: this.f["team"].value.members[i].username });
    }
    this.f['usersSelected'].setValue(selectedItems)
  }
  saveChanges() {

    if (!this.f["team"].value)
      return
    this.f['team'].value.members = []
    for (let i = 0; i < this.f['usersSelected'].value.length; i++) {
      for (let j = 0; j < this.allusers.length; j++) {
        if (this.allusers[j].username == this.f['usersSelected'].value[i].item_text) {
          this.f['team'].value.members.push(this.allusers[j].id)
        }
      }
    }
    this.manageteamsservice.updateTeam(this.f['team'].value).subscribe({
      next: (msg) => {
        this.error = '';
        this.message = msg.msg;
        setTimeout(() => {
          this.message = ''
        }, 2 * 1000);
        this.manageteamsservice.getTeams()
          .subscribe({
            next: (teams) => {
              this.listOfTeams = teams;
              console.log("Teams getted : " + this.listOfTeams.length)
            },
            error: error => {
              this.listOfTeams = {} as Team[];
              console.log("Teams not getted : " + this.listOfTeams.length)
            }
          });
      },
      error: error => {
        this.message = '';
        this.error = error;
      }
    });


  }
}

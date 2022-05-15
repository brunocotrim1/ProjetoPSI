import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { ScheduleReunionService } from './schedulereunion.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedulereunion',
  templateUrl: './schedulereunion.component.html',
  styleUrls: ['./schedulereunion.component.scss']
})

export class SchedulereunionComponent implements OnInit {

  user = {} as User;

  loading = false;
  submitted = false;
  error = '';
  returnmessage = '';

  dropdownList: any[] = [];
  dropdownUsers: any[] = [];
  listOfAvailableDates: any[] = [];
  listOfAvailableDays: any[] = [];
  listOfavailableHours: any[] = [];
  dropdownSettings: any = {};
  isMultiDropdownOpen = false;

  scheduleForm = new FormGroup(
    {
    members: new FormControl('', ),
    reunionTime: new FormControl('', [Validators.required, Validators.pattern(new RegExp("^([0-1]?[0-9]|2[0-3]):(30|00)$"))]),
    inicialDate: new FormControl('', [Validators.required]),
    finalDate: new FormControl('', [Validators.required]),
    availableDates: new FormControl('', [Validators.required]),
    availableDay: new FormControl('', [Validators.required]),
    availableHour: new FormControl('', [Validators.required])
    }
  );

  model: NgbDateStruct | undefined;
  model1: NgbDateStruct | undefined;

  constructor(    
    private schedulereunionservice: ScheduleReunionService,
    private authenticationService: AuthenticationService,) {
  }


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
    return this.scheduleForm.controls; 
  }

  fillInDropdown(typeobject: string) {
    if (typeobject === "Project") {
      //ir fazer getallprojects do service do project
    } else if (typeobject === "Team") {
      this.dropdownList = [];
      this.schedulereunionservice.getAllUsers().subscribe(
        userList => {
          this.dropdownList = [...userList].map(x => x.username);
          this.dropdownUsers = userList as any[];
        }
      );
    }
  }

  onTabShowSelect(){
    if (!this.isMultiDropdownOpen){
      this.isMultiDropdownOpen = true;
    } else {
      this.isMultiDropdownOpen = false;
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 6,
      allowSearchFilter: true,
      defaultOpen: this.isMultiDropdownOpen
    };
  }

  onSubmit() {
    this.submitted = true;

    if (this.scheduleForm.invalid) {
      return;
    }

    const fetchUsers = () => {
      return this.dropdownUsers.filter(x => this.f["members"].value.includes(x.username)).map((x: any) => x.id)
    }

    this.schedulereunionservice.scheduleReunion({ members: fetchUsers()})
    .subscribe({
      next: () => {
        this.returnmessage = 'Reunion was scheduled!';
        setTimeout(() => {this.returnmessage = ''}, 2*1000);
        this.loading = false;
      },
      error: () => {
        this.returnmessage = 'Error scheduling';
        setTimeout(() => {this.returnmessage = ''}, 2*1000);
        this.loading = false;
      }
    })
  }

  //////////////////////////////////////////////////////////////

}

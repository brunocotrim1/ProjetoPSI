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

  loadingSchedule = false;
  submittedSchedule = false;
  errorSchedule = '';
  returnmessageSchedule = '';

  loadingReunion = false;
  submittedReunion = false;
  errorReunion = '';
  returnmessageReunion = '';

  scheduleForm = new FormGroup(
    {
    members: new FormControl('', ),
    reunionTime: new FormControl('', [Validators.required, Validators.pattern(new RegExp("^([0-1]?[0-9]|2[0-3]):(30|00)$"))]),
    inicialDate: new FormControl('', [Validators.required]),
    finalDate: new FormControl('', [Validators.required])
    }
  );

  availabilityForm = new FormGroup(
    {
    availableDates: new FormControl('', [Validators.required]),
    availableDay: new FormControl('', [Validators.required]),
    availableHour: new FormControl('', [Validators.required])
    }
  );

  model: NgbDateStruct | undefined;
  model1: NgbDateStruct | undefined;

  dropdownList: any[] = [];
  dropdownUsers: any[] = [];
  listOfAvailableDates: any[] = [];
  listOfAvailableDays: any[] = [];
  listOfavailableHours: any[] = [];
  dropdownSettings: any = {};
  isMultiDropdownOpen = false;

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

  get f1() { 
    return this.availabilityForm.controls; 
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

  onSubmitSchedule() {
    this.submittedSchedule = true;

    if (this.scheduleForm.invalid) {
      return;
    }

    this.loadingReunion = false;
  }

  onSubmitReunion() {
    this.submittedReunion = true;

    if (this.availabilityForm.invalid) {
      return;
    }

    const fetchUsers = () => {
      return this.dropdownUsers.filter(x => this.f["members"].value.includes(x.username)).map((x: any) => x.id)
    }

    this.schedulereunionservice.scheduleReunion({ members: fetchUsers()})
    .subscribe({
      next: () => {
        this.returnmessageReunion = 'Reunion was scheduled!';
        setTimeout(() => {this.returnmessageReunion = ''}, 2*1000);
        this.loadingReunion = false;
      },
      error: () => {
        this.returnmessageReunion = 'Error scheduling';
        setTimeout(() => {this.returnmessageReunion = ''}, 2*1000);
        this.loadingReunion = false;
      }
    })
  }

  //////////////////////////////////////////////////////////////

}

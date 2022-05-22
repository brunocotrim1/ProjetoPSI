import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { ScheduleReunionService } from './schedulereunion.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Reunion } from '../Reunion';
import { Unavailability } from '../Unavailabilty';

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

  showInformation = false;
  showHours = false;
  
  isZero = false;
  isBiggerThanEight = false;
  isNotMultiple30 = false;
  
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  //Validators.pattern(new RegExp("^(0?[1-7]):(30|00)|(0?8):00|(0?0):30$"))

  scheduleForm = new FormGroup(
    {
    members: new FormControl('', this.DropdownValidator),
    reunionTime: new FormControl('', [Validators.required, this.DurationValidator]),
    inicialDate: new FormControl('', [Validators.required]),
    finalDate: new FormControl('', [Validators.required])
    }
  );

  DropdownValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value.length == 0) {
      return { 'dropdown-error': true };
    }
    return null;
  }

  DurationValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value.includes(":") || control.value.length > 5 || control.value.length < 4) {
      return { 'duration-error': true };
    }
    var reunionTime = control.value.split(":") 
    if (reunionTime[0].length == 0 || reunionTime[0].length > 2 || reunionTime[1].length != 2 ) {
      return { 'duration-error': true };
    }
    if (reunionTime[1] != undefined){
        var errorList = {} as any
        var blockHour: number = +reunionTime[0]
        var blockMinute: number = +reunionTime[1]
        var isZero = blockHour == 0 && blockMinute == 0
        var isBiggerThanEight = (blockHour == 8 && blockMinute > 0) || (blockHour > 8)
        var isNotMultiple30 = blockMinute != 0 && blockMinute != 30
        if (isZero) {
          errorList['duration-errorisZero'] = true;
        }
        if (isBiggerThanEight) {
          errorList['duration-errorisBiggerThanEight'] = true;
          //return { 'duration-errorisBiggerThanEight': true };
        }
        if (isNotMultiple30) {
          errorList['duration-errorisNotMultiple30'] = true;
          //return { 'duration-errorisNotMultiple30': true };
        }
        if (isNotMultiple30 || isBiggerThanEight || isZero){
          return errorList
        }
    } else {
      return { 'duration-error': true };
    }

    return null;

    
  }

  availabilityForm = new FormGroup(
    {
    availableDay: new FormControl('', [Validators.required]),
    availableHour: new FormControl('', [Validators.required])
    }
  );

  model: NgbDateStruct | undefined;
  model1: NgbDateStruct | undefined;

  dropdownList: any[] = [];
  dropdownUsers: any[] = [];
  listOfReunions: Reunion[] = [];
  listOfUnavailableTimes: Unavailability[] = [];
  listOfAllUnavailables: any[] = [];
  listOfAvailableBlocks: any[] = [];
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

    var InitialDate = new Date(this.f["inicialDate"].value.year,this.f["inicialDate"].value.month-1,this.f["inicialDate"].value.day,9,30,0,0)
    var FinalDate = new Date(this.f["finalDate"].value.year,this.f["finalDate"].value.month-1,this.f["finalDate"].value.day,17,30,0,0)

    var curdate = new Date(new Date().setHours(9,30,0,0));
    if(InitialDate < curdate) {
      this.f['inicialDate'].setErrors({'beforeCurrentDate': true});
    }

    if(InitialDate > FinalDate)  {
      this.f['finalDate'].setErrors({'afterFinalDate': true});
    }

    if (this.scheduleForm.invalid) {
      return;
    }
    this.schedulereunionservice.getAllUnavailables()
    .subscribe({
      next: (unavailables) => {      
        this.listOfAllUnavailables = [];  
        this.listOfUnavailableTimes = [];
        this.listOfUnavailableTimes = unavailables;
        var currentUsers = this.fetchUsers()
        for(let i = 0; i < this.listOfUnavailableTimes.length; i++){
          var oneTimeUnavailability = true;
          for(let j = 0; j < currentUsers.length; j++){
              if(oneTimeUnavailability && this.listOfUnavailableTimes[i].user == currentUsers[j]){
                this.listOfAllUnavailables.push({beginDate: new Date(this.listOfUnavailableTimes[i].beginDate), endDate: new Date(this.listOfUnavailableTimes[i].endDate)})
                oneTimeUnavailability = false;
              }
          }
        }
        // var numbersCopy = this.listOfAllUnavailables.reduce((newArray, element) => {
        //   newArray.push(element);
        //   return newArray;
        // }, []);
        // console.log("INDISPONIBILIDADE:",numbersCopy)
        this.schedulereunionservice.getAllReunions()
        .subscribe({
        next: (reunions) => {
          this.listOfAvailableBlocks = [];
          this.listOfAvailableDays = [];
          this.listOfavailableHours = [];
          this.listOfReunions = [];
          this.listOfReunions = reunions
          var currentUsers = this.fetchUsers()
          for(let i = 0; i < this.listOfReunions.length; i++){
            var oneTimeReunion = true;
            for(let j = 0; j < currentUsers.length; j++){
                if(oneTimeReunion && this.listOfReunions[i].members.includes(currentUsers[j])){
                  this.listOfAllUnavailables.push({beginDate: new Date(this.listOfReunions[i].beginDate), endDate: new Date(this.listOfReunions[i].endDate)})
                  oneTimeReunion = false;
                }
            }
          }
          console.log(this.listOfAllUnavailables)

          var listOfBlocks = []
          var hasReachEnd = false
          var blockInit = new Date(this.f["inicialDate"].value.year,this.f["inicialDate"].value.month-1,this.f["inicialDate"].value.day,9,30,0,0)
          var blockEnd = new Date(this.f["finalDate"].value.year,this.f["finalDate"].value.month-1,this.f["finalDate"].value.day,17,30,0,0)
          while(!hasReachEnd){
            if(blockInit.getTime() == blockEnd.getTime()){
              hasReachEnd = true
              break;
            }
            var isDirtyBlock = false;
            var blockFinalDate;
            blockFinalDate = new Date(blockInit.getTime()+(30*60*1000))
            let startTime = new Date(blockInit.getFullYear(),blockInit.getMonth(),blockInit.getDate(),9,30,0,0);
            let endTime = new Date(blockInit.getFullYear(),blockInit.getMonth(),blockInit.getDate(),17,30,0,0);

            if (blockInit.getTime() >= startTime.getTime() && blockInit.getTime() < endTime.getTime()) {
              for(let i = 0; i < this.listOfAllUnavailables.length; i++){
                if(blockInit.getTime() < this.listOfAllUnavailables[i].endDate.getTime() && this.listOfAllUnavailables[i].beginDate.getTime() < blockFinalDate.getTime()){
                  isDirtyBlock = true;
                  break;
                }
              }
              if(!isDirtyBlock){
                listOfBlocks.push({blockInit: blockInit, blockFinal: blockFinalDate})
              }
            }  
            blockInit = new Date(blockInit.getTime()+(30*60*1000))      
          }

          var reunionTime = this.f["reunionTime"].value.split(":") 
          var blockHour: number = +reunionTime[0]
          var blockMinute: number = +reunionTime[1]
          if(this.listOfAllUnavailables.length != 0){
            var listOfBlocksWithDuration = []
            for(let i = 0; i < listOfBlocks.length; i++){
              var isDirtyBlockDuration = false
              for(let k = 0; k < this.listOfAllUnavailables.length; k++){
                if((listOfBlocks[i].blockInit.getTime() < this.listOfAllUnavailables[k].endDate.getTime() 
                && listOfBlocks[i].blockInit.getTime()+(blockHour*60*60*1000)+(blockMinute*60*1000) > this.listOfAllUnavailables[k].beginDate.getTime())
                || listOfBlocks[i].blockInit.getTime()+(blockHour*60*60*1000)+(blockMinute*60*1000) > 
                new Date(listOfBlocks[i].blockInit.getFullYear(),listOfBlocks[i].blockInit.getMonth(),listOfBlocks[i].blockInit.getDate(),17,30,0,0).getTime()){
                  isDirtyBlockDuration = true
                }
              }
              if(!isDirtyBlockDuration){
                listOfBlocksWithDuration.push(listOfBlocks[i])
              }
            }
            listOfBlocks = listOfBlocksWithDuration
          } else {
            var listOfBlocksWithDuration = []
            for(let i = 0; i < listOfBlocks.length; i++){
              if (!(listOfBlocks[i].blockInit.getTime()+(blockHour*60*60*1000)+(blockMinute*60*1000) > 
              new Date(listOfBlocks[i].blockInit.getFullYear(),listOfBlocks[i].blockInit.getMonth(),listOfBlocks[i].blockInit.getDate(),17,30,0,0).getTime())){
                listOfBlocksWithDuration.push(listOfBlocks[i])
              }
            }
            listOfBlocks = listOfBlocksWithDuration
          }
          this.listOfAvailableBlocks = listOfBlocks

        for(let i = 0; i < this.listOfAvailableBlocks.length; i++){
          var dayOfBlock = this.listOfAvailableBlocks[i].blockInit.getDate();
          var monthOfBlock = this.listOfAvailableBlocks[i].blockInit.getMonth();
          if(!this.listOfAvailableDays.includes("Day "+dayOfBlock+" of "+this.monthNames[monthOfBlock])){
            this.listOfAvailableDays.push("Day "+dayOfBlock+" of "+this.monthNames[monthOfBlock])
          }
        }
          
        },
        error: () => {
          this.listOfAvailableBlocks = [];
          this.listOfAvailableDays = [];
          this.listOfavailableHours = [];
          this.listOfReunions = [];
        }
      });

      this.loadingReunion = false;
      this.showInformation = true;
      },
      error: () => {
        this.listOfUnavailableTimes = [];
      }
    });
  }

  fetchUsers() {
    return this.dropdownUsers.filter(x => this.f["members"].value.includes(x.username)).map((x: any) => x.id)
  }

  showInformationOff(){
    this.availabilityForm.reset({'availableDay': '', 'availableHour': ''})
    this.showInformation = false;
    this.showHours = false;
    this.listOfAvailableBlocks = [];
    this.listOfAvailableDays = [];
    this.listOfavailableHours = [];
    this.listOfReunions = [];
    this.listOfUnavailableTimes = [];
    this.listOfAllUnavailables = [];
  }

  generateHours(){
    this.showHours = true;
    this.listOfavailableHours = [];
    for(let i = 0; i < this.listOfAvailableBlocks.length; i++){
      var dayAndMonth = this.f1["availableDay"].value;
      var dayBlock = this.listOfAvailableBlocks[i].blockInit.getDate();
      var monthBlock = this.monthNames[this.listOfAvailableBlocks[i].blockInit.getMonth()];
      if("Day "+dayBlock+" of "+monthBlock == dayAndMonth){
        var minutes = this.listOfAvailableBlocks[i].blockInit.getMinutes();
        if(minutes == "0"){
          minutes = minutes+"0"
        }
        this.listOfavailableHours.push(this.listOfAvailableBlocks[i].blockInit.getHours()+":"+minutes)
      }
    }
  }


  onSubmitReunion() {
    this.submittedReunion = true;

    if (this.availabilityForm.invalid || this.scheduleForm.invalid) {
      return;
    }

    var startDateReunion = new Date(new Date(2022,this.monthNames.indexOf(this.f1["availableDay"].value.split(" ")[3]), this.f1["availableDay"].value.split(" ")[1])
    .getTime()+(this.f1["availableHour"].value.split(":")[0]*60*60*1000)+(this.f1["availableHour"].value.split(":")[1]*60*1000))
    var reunion = {
      members: this.fetchUsers(), 
      beginDate: startDateReunion,
      endDate: new Date(startDateReunion.getTime()+(this.f["reunionTime"].value.split(":")[0]*60*60*1000)+(this.f["reunionTime"].value.split(":")[1]*60*1000))
    }
    this.schedulereunionservice.createReunion({reunion})
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

}

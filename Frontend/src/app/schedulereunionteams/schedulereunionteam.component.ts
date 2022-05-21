import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { ScheduleReunionteamService } from './schedulereunionteam.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Reunion } from '../Reunion';
import { Team } from '../Team';

@Component({
  selector: 'app-schedulereunionteam',
  templateUrl: './schedulereunionteam.component.html',
  styleUrls: ['./schedulereunionteam.component.scss']
})

export class SchedulereunionteamComponent implements OnInit {

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

  //"^([0-1]?[0-9]|2[0-3]):(30|00)$"
  //^(0?[1-7]):(30|00)|(0?8):00|(0?0):30$

  scheduleForm = new FormGroup(
    {
    team: new FormControl('', Validators.required),
    reunionTime: new FormControl('', [Validators.required, Validators.pattern(new RegExp("^(0?[1-7]):(30|00)|(0?8):00|(0?0):30$"))]),
    inicialDate: new FormControl('', [Validators.required]),
    finalDate: new FormControl('', [Validators.required])
    }
  );

  availabilityForm = new FormGroup(
    {
    availableDay: new FormControl('', [Validators.required]),
    availableHour: new FormControl('', [Validators.required])
    }
  );

  model: NgbDateStruct | undefined;
  model1: NgbDateStruct | undefined;

  listOfReunions: Reunion[] = [];
  listOfAllUnavailables: any[] = [];
  listOfAvailableBlocks: any[] = [];
  listOfAvailableDays: any[] = [];
  listOfavailableHours: any[] = [];
  listOfTeams: Team[] = [];

  constructor(    
    private schedulereunionservice: ScheduleReunionteamService,
    private authenticationService: AuthenticationService,) {
  }


  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
    this.schedulereunionservice.getTeams().subscribe({
      next: (teams) => {
        this.listOfTeams = teams;
      },
      error: error => {
        this.listOfTeams = {} as Team[];
      }
    });
  }

  get f() { 
    return this.scheduleForm.controls; 
  }

  get f1() { 
    return this.availabilityForm.controls; 
  }

  onChangeDurationReunion(){
    var reunionTime = this.f["reunionTime"].value.split(":") 
    if(this.f["reunionTime"].errors){
      console.log("Entered1")
      if (reunionTime[1] != undefined){
        var blockHour: number = +reunionTime[0]
        var blockMinute: number = +reunionTime[1]
        this.isZero = blockHour == 0 && blockMinute == 0
        //console.log("IsRegexZero?",this.isZero, reunionTime)
        this.isBiggerThanEight = (blockHour == 8 && blockMinute > 0) || (blockHour > 8)
        //console.log("IsRegexBigger8?",this.isBiggerThanEight, reunionTime)
        this.isNotMultiple30 = blockMinute != 0 && blockMinute != 30 
        //console.log("IsRegexNotMultiple?",this.isNotMultiple30, reunionTime)
      }
    } else {
      this.isZero = false;
      this.isBiggerThanEight = false;
      this.isNotMultiple30 = false;
    }


      // if(this.isZero) {
      //   this.f['reunionTime'].setErrors({"isZero": true});
      // } 
      // if(this.isBiggerThanEight) {
      //   this.f['reunionTime'].setErrors({"isBiggerThanEight": true});
      // } 
      // if(this.isNotMultiple30) {
      //   this.f['reunionTime'].setErrors({"isNotMultiple30": true});
      // } 

      //console.log(this.f['reunionTime'].errors[])
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

    this.schedulereunionservice.getAllReunions()
      .subscribe({
        next: (reunions) => {
          this.listOfAvailableBlocks = [];
          this.listOfAvailableDays = [];
          this.listOfavailableHours = [];
          this.listOfAllUnavailables = [];
          this.listOfReunions = [];
          //------------
          this.listOfReunions = reunions
          var currentUsers = this.f["team"].value.members.map((x: any) => x._id)
          console.log(currentUsers)
          for(let i = 0; i < this.listOfReunions.length; i++){
            var oneTimeReunion = true;
            for(let j = 0; j < currentUsers.length; j++){
                if(oneTimeReunion && this.listOfReunions[i].members.includes(currentUsers[j])){
                  this.listOfAllUnavailables.push({beginDate: new Date(this.listOfReunions[i].beginDate), endDate: new Date(this.listOfReunions[i].endDate)})
                  oneTimeReunion = false;
                }
            }
          }

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
          this.listOfAllUnavailables = [];
          this.listOfReunions = [];
        }
      });

    this.loadingReunion = false;
    this.showInformation = true;
  }

  showInformationOff(){
    this.availabilityForm.reset({'availableDay': '', 'availableHour': ''})
    this.showInformation = false;
    this.showHours = false;
  }

  generateHours(){
    this.showHours = true;
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
      possibleTeam: this.f["team"].value._id,
      members: this.f["team"].value.members, 
      beginDate: startDateReunion,
      endDate: new Date(startDateReunion.getTime()+(this.f["reunionTime"].value.split(":")[0]*60*60*1000)+(this.f["reunionTime"].value.split(":")[1]*60*1000))
    }
    console.log(reunion)
    this.schedulereunionservice.createReunion({reunion})
    .subscribe({
      next: () => {
        this.returnmessageReunion = 'Team reunion was scheduled!';
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

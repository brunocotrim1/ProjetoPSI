import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators, FormGroupDirective, NgForm,} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { ProjectsService } from './projects.service';
import Validation from './validation';
import {ErrorStateMatcher} from '@angular/material/core';
import { Project } from '../Project';
import { Team } from '../Team';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projectForm = new FormGroup(
    {
    project: new FormControl('', Validators.required)
    }
  );

  selectedTeamForm = new FormGroup(
    {
    selteam: new FormControl('', Validators.required)
    }
  );

  loading = false;
  submitted = false;
  returnUrl!: string;
  showUnasignedInfo = false;
  error = '';
  returnmessage = '';

  user = {} as User;
  listOfProjects = [] as Project[];
  listOfTeams = [] as Team[];
  listOfAvailableTeams = [] as Team[];
  currentProject = {} as Project;
  currentProjectTeam = {} as Team;

  constructor(
  private projectsService: ProjectsService,
  private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;

    this.projectsService.getProjects()
    .subscribe({
      next: (project) => {
        this.listOfProjects = project;
        this.projectsService.getTeams()
        .subscribe({
          next: (teams) => {
            this.listOfTeams = teams;
            this.listOfAvailableTeams = Array<Team>();
            for(let i = 0; i < this.listOfTeams.length; i++) {
              var isNotValidTeam = false;
              for (let f = 0; f < this.listOfProjects.length; f++) {
                if(this.listOfProjects[f].linkedTeam == this.listOfTeams[i]._id){
                  isNotValidTeam = true;
                }
              }
              if(!isNotValidTeam){
                this.listOfAvailableTeams.push(this.listOfTeams[i]);
              }
            }
            console.log("AVAILABLE TEAMS: ",this.listOfAvailableTeams)
          },
          error: error => {
            this.listOfTeams = {} as Team[];
            this.listOfAvailableTeams = {} as Team[];
            this.error = error;
            this.loading = false;
          }
        });
      },
      error: error => {
        this.listOfProjects = {} as Project[];
        this.error = error;
        this.loading = false;
      }
    });
  }

  
  get f() { 
    return this.projectForm.controls; 
  }

  get f1() { 
    return this.selectedTeamForm.controls; 
  }

  checkIfNoProjects(){
    return Object.keys(this.listOfProjects).length === 0;
  }

  checkIfNoTeams(){
    return Object.keys(this.listOfTeams).length === 0;
  }

  checkIfExistsCurrentProject(){
    return Object.keys(this.currentProject).length !== 0;
  }

  checkIfExistsTeamProject(){
    return Object.keys(this.currentProjectTeam).length !== 0;
  }

  updateShowUnasignedInfo(){
    this.showUnasignedInfo = true;
  }

  onChangeObj() {
    this.currentProject = this.f["project"].value
    this.currentProject.beginDate = new Date(this.currentProject.beginDate)
    if (this.currentProject.endDate){
      this.currentProject.endDate = new Date(this.currentProject.endDate)
    } 
    if(this.f["project"].value.linkedTeam != undefined){
      console.log("This project has a linked team")
      this.projectsService.getTeam(this.f["project"].value.linkedTeam)
      .subscribe({
        next: (team) => {
          this.currentProjectTeam = team;
          // console.log("Projects =>",this.listOfProjects)
          // console.log("Teams =>",this.listOfTeams)
          // console.log("Current Project onChangeObj =>",this.currentProject)
          // console.log("Current Project Team onChangeObj =>",this.currentProjectTeam)
        },
        error: error => {
          this.currentProjectTeam = {} as Team;
          //console.log("ERRO NO PEDIDO DE TEAM")
          this.error = error;
          this.loading = false;
        }
      });
    } else {
      this.currentProjectTeam = {} as Team;
    }
  }
  
  onSubmitTeam() {
    //this.currentProject.linkedTeam
    this.showUnasignedInfo = false;
    this.currentProject.linkedTeam = this.f1["selteam"].value._id
    this.currentProjectTeam = this.f1["selteam"].value
    console.log("BEFORE UPDATE =>",this.listOfAvailableTeams)
    this.listOfAvailableTeams = this.listOfAvailableTeams.filter((item) => {
      return item != this.f1["selteam"].value
    })
    console.log("AFTER UPDATE =>",this.listOfAvailableTeams)
    for (let i = 0; i < this.listOfProjects.length; i++) {
      if (this.listOfProjects[i].name == this.currentProject.name){
        this.listOfProjects[i] = this.currentProject
      }
    }
    this.submitted = true;
    if (this.selectedTeamForm.invalid) {
      return;
    }
    this.loading = true;
    this.projectsService.updateProject(this.currentProject._id, this.f1["selteam"].value._id)
      .subscribe({
        next: () => {
          // console.log("Projects =>",this.listOfProjects)
          // console.log("Teams =>",this.listOfTeams)
          // console.log("Current Project submitTeam =>",this.currentProject)
          // console.log("Current Project Team submitTeam =>",this.currentProjectTeam)
          this.returnmessage = "Team has been linked!";
          this.loading = false;
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  updateAndRemoveTeam(){
    this.currentProject.linkedTeam = "";
    this.listOfAvailableTeams.push(this.currentProjectTeam)
    //console.log("UNSORTED =>",this.listOfAvailableTeams)
    this.listOfAvailableTeams.sort((a,b) => a.name.localeCompare(b.name));
    //console.log("SORTED =>",this.listOfAvailableTeams)
    this.currentProjectTeam = {} as Team;
    this.projectsService.updateProject(this.currentProject._id, "")
      .subscribe({
        next: () => {
          // console.log("Projects =>",this.listOfProjects)
          // console.log("Teams =>",this.listOfTeams)
          // console.log("Current Project updateandremove =>",this.currentProject)
          // console.log("Current Project Team updateandremove =>",this.currentProjectTeam)
          this.returnmessage = "Team has been removed!";
          setTimeout(() => {this.returnmessage = ''
          }, 2*1000);
          this.loading = false;
        },
        error: error => {
          this.error = error;
          setTimeout(() => {this.error = ''
          }, 2*1000);
          this.loading = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.projectForm.reset();
  }

  refresh(): void {
    window.location.reload();
  }
}

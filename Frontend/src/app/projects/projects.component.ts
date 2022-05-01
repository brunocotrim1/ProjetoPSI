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

  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  returnmessage = '';

  user = {} as User;
  listOfProjects = {} as Project[];
  listOfTeams = {} as Team[];
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
      },
      error: error => {
        this.listOfProjects = {} as Project[];
        this.error = error;
        this.loading = false;
      }
    });
  }

  checkIfProjects(){
    return Object.keys(this.listOfProjects).length === 0;
  }

  checkIfEmptyObject(){
    return Object.keys(this.currentProject).length !== 0;
  }

  checkIfExistsTeam(){
    return Object.keys(this.currentProjectTeam).length !== 0;
  }

  onChangeObj() {
    this.currentProject = this.f["project"].value
    this.projectsService.getTeam(this.f["project"].value.linkedTeam)
    .subscribe({
      next: (team) => {
        this.currentProjectTeam = team;
        console.log(this.currentProjectTeam)
      },
      error: error => {
        this.currentProjectTeam = {} as Team;
        this.error = error;
        this.loading = false;
      }
    });
  }
  
  get f() { 
    return this.projectForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }
    this.loading = true;
    this.projectsService.getProjects()
      .subscribe({
        next: () => {
          this.returnmessage = "New user created!";
          this.loading = false;
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.projectForm.reset();
  }
}

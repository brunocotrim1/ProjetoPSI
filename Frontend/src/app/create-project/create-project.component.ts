import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateProjectService } from './createproject.service';
import Validation from './validation';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {


  projectForm = new FormGroup(
    {
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)]),
    acronym: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)]),
    beginDate: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)]),
    endDate: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9]+$/i)]),
    }
  );

  defaultrole = "USER";
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  returnmessage = '';

  user = {} as User;

  constructor(
    private formBuilder: FormBuilder,
    private createuprojectservice: CreateProjectService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
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

    this.createuprojectservice.createProject(this.f["name"].value, this.f["acronym"].value, this.f["beginDate"].value, this.f["endDate"].value)
      .subscribe({
        next: () => {
          this.returnmessage = "New project created!";
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

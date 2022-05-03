import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators, FormGroupDirective, NgForm,} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { LinkprojectstoteamsService } from './linkprojectstoteams.service';
import Validation from './validation';
import {ErrorStateMatcher} from '@angular/material/core';
import { Project } from '../Project';

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-linkprojectstoteams',
  templateUrl: './linkprojectstoteams.component.html',
  styleUrls: ['./linkprojectstoteams.component.scss']
})
export class LinkprojectstoteamsComponent implements OnInit {
  
  // selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  // selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  // nativeSelectFormControl = new FormControl('valid', [
  //   Validators.required,
  //   Validators.pattern('valid'),
  // ]);

  // matcher = new MyErrorStateMatcher();

  projectForm = new FormGroup(
    {
    role: new FormControl('', Validators.required)
    }
  );

  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  returnmessage = '';

  user = {} as User;
  listOfProjects = {} as Project[];

  constructor(
    private formBuilder: FormBuilder,
    private linkprojectstoteamsService: LinkprojectstoteamsService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
    this.linkprojectstoteamsService.getProjects()
    .subscribe({
      next: (project) => {
        this.listOfProjects = project;
        console.log("projetos get feito success");
      },
      error: error => {
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
    this.linkprojectstoteamsService.getProjects()
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

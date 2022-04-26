import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateuserService } from './createuser.service';
import Validation from './validation';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})

export class CreateUserComponent implements OnInit {

  userForm = new FormGroup(
    {
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9]+$/i)]),
    role: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required)
    }, {
      validators: [Validation.match('password', 'confirm_password')]
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
    private createuserservice: CreateuserService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }

  get f() { 
    return this.userForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    console.log(this.f["username"].value)
    console.log(this.f["password"].value)
    console.log(this.f["role"].value)
    this.createuserservice.createUser(this.f["username"].value, this.f["password"].value, this.f["role"].value)
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
    this.userForm.reset();
  }
}
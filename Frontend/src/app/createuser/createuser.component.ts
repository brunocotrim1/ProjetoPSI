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
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)]),
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
  requiredPass: any;
  minLengthPass: any;
  patternPass: any;
  invalidPass: any;

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
      this.invalidPass = this.submitted && this.f['password'].errors
      this.requiredPass = this.f['password'].errors!['required']
      this.minLengthPass = this.f['password'].errors!['minlength']
      this.patternPass = this.f['password'].errors!['pattern']
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
    this.userForm.reset();
  }
}
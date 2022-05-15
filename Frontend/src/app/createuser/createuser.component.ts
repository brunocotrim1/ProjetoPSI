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
  needsUpperCase = true
  needsLowerCase = true
  needsDigit = true

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

  onChangeCheckPass(){
    if(this.f["password"].errors){
      console.log("checkstuff")
      this.needsUpperCase = !(/^(?=.*[A-Z]).*$/.test(this.f["password"].value))
      this.needsLowerCase = !(/^(?=.*[a-z]).*$/.test(this.f["password"].value))
      this.needsDigit = !(/^(?=.*\d).*$/.test(this.f["password"].value))
    } else {
      this.needsUpperCase = false
      this.needsLowerCase = false
      this.needsDigit = false
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    } 
    this.loading = true;
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
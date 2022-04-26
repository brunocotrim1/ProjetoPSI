import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateuserService } from './createuser.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})

export class CreateUserComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    role: new FormControl('',Validators.required),
    confirm_password: new FormControl('',Validators.required)
  });

  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  returnmessage = '';

  user = {} as User;

  constructor(
    private router: Router,
    private createuserservice: CreateuserService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }

  get f() { 
    return this.loginForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.createuserservice.createUser(this.f["username"].value, this.f["password"].value, this.f["role"].value)
      .subscribe({
        next: (msg) => {
          this.returnmessage = msg.msg;
          console.log(msg.msg);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}
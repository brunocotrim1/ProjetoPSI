import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Task } from '../Task';
import { User } from '../User';
import { CreateTaskService } from './create-task.service';
import Validation from './validation';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent implements OnInit {

  taskForm = new FormGroup(
    {
      taskname: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9]+$/i)]),
    
      priority: new FormControl('', Validators.required),
      
    }
  );

  defaultpriority = "LOW";
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  returnmessage = '';

  user = {} as User;

  constructor(
    private formBuilder: FormBuilder,
    private createtaskservice: CreateTaskService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }

  get f() { 
    return this.taskForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    if (this.taskForm.invalid) {
      return;
    }
    this.loading = true;
    
    this.createtaskservice.createTask(this.f["taskname"].value, this.f["priority"].value, 0, this.user)
      .subscribe({
        next: () => {
          this.returnmessage = "New task created!";
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
    this.taskForm.reset();
  }
}
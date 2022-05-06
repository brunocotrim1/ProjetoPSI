import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/User';
import { Task } from 'src/app/Task';
import { TaskDetailService } from './task-detail.service';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ThemePalette } from '@angular/material/core';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  form = new FormGroup({
    usersform: new FormControl('', Validators.required),
    beginDate: new FormControl('',[]),
    endDate: new FormControl('',[]),
  });
  @ViewChild('picker') picker: any;
  @ViewChild('picker') picker2: any;
  user = {} as User;
  task = {} as Task;
  users = [] as User[];

  dropdownSettings: any = {};
  selectedItems: Array<any> = [];
  data: Array<any> = [];
  ShowFilter = true;
  limitSelection = false;
  message = ''
  error = ''
  public minDate!: Date;
  public maxDate!: Date;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public date: Date = new Date();
  public color: ThemePalette = 'warn';
  public disableMinute = false;
  public hideTime = false;
  constructor(private taskDetailService: TaskDetailService, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  ngOnInit(): void {
    this.user = this.taskDetailService.getUser();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.data = [];
    this.taskDetailService.getUsers().subscribe({
      next: (users) => {
        this.users = users
        for (let i = 0; i < users.length; i++) {
          let novoUser = { item_id: i, item_text: users[i].username };
          this.data = [
            ...this.data, novoUser
          ];

        } this.taskDetailService.getTaskDetail(id).subscribe({
          next: (task) => {
            this.task = task;
            console.log(this.data)
            for (let i = 0; i < this.data.length; i++) {
              for (let j = 0; j < this.task.usersAssigned.length; j++) {
                if (this.task.usersAssigned[j].username == this.data[i].item_text) {
                  this.selectedItems.push(this.data[i]);
                }
              }
            } this.f['usersform'].setValue(this.selectedItems);
            this.task.beginDate = new Date(this.task.beginDate);
            this.task.endDate = new Date(this.task.endDate);
            this.f['beginDate'].setValue( this.task.beginDate);
            this.f['endDate'].setValue(this.task.endDate);
          },
          error: error => {
            this.task = {} as Task;
          }
        });

      },
      error: error => {
      }
    })


    //  this.selectedItems = [{ item_id: 4, item_text: 'Pune' }, { item_id: 6, item_text: 'Navsari' }];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 6,
      allowSearchFilter: this.ShowFilter
    };

  }

  get f() { return this.form.controls; }


  saveChanges() {
    if(this.f['beginDate'].value._d){
      this.task.beginDate = new Date(this.f['beginDate'].value._d);
    }
    if(this.f['endDate'].value._d){
      this.task.endDate = new Date(this.f['endDate'].value._d);
    }
    this.task.usersAssigned = [];
    for (let i = 0; i < this.f['usersform'].value.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (this.users[j].username == this.f['usersform'].value[i].item_text) {
          this.task.usersAssigned.push(this.users[j].id)
        }
      }
    }
    this.taskDetailService.saveTask(this.task).subscribe({
      next: (msg) => {
        this.message = msg.msg;
      },
      error: error => {
        this.error = error;
      }
    });
  }
}

import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/User';
import { Task } from 'src/app/Task';
import { TaskDetailService } from './task-detail.service';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ThemePalette } from '@angular/material/core';
import { Project } from '../Project';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  form = new FormGroup({
    usersform: new FormControl('', Validators.required),
    beginDate: new FormControl('', []),
    endDate: new FormControl('', []),
    project: new FormControl('', Validators.required),
    progress: new FormControl('', Validators.required),
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
  checklist: any = {}; //{'A': false, 'B': false, 'C': false};

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
  public showCheck = false;
  constructor(private taskDetailService: TaskDetailService, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  loading = false;
  submitted = false;
  returnUrl!: string;
  showUnasignedInfo = false;
  listOfProjects = [] as Project[];
  currentProject = {} as Project;
  returnmessage = '';
  isTaskRelated = false;
  isMultiDropdownOpen = false;

  isOnCheckList = false;

  ngOnInit(): void {
    
    console.log("HAS CHECKLIST", this.showCheck);
    this.user = this.taskDetailService.getUser();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.data = [];
    
    
    console.log("HAS CHECKLIST 2", this.showCheck);
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
            this.checklist = task.checklist;
            this.showCheck = this.hasChecklist();
            console.log(this.checklist);
            console.log(typeof this.checklist["aaaa"])
            this.f['progress'].setValue(task.progress)
            console.log( this.f['progress'].value)
            for (let i = 0; i < this.data.length; i++) {
              for (let j = 0; j < this.task.usersAssigned.length; j++) {
                if (this.task.usersAssigned[j].username == this.data[i].item_text) {
                  this.selectedItems.push(this.data[i]);
                }
              }
            } 
            this.f['usersform'].setValue(this.selectedItems);
            if (this.task.beginDate && this.task.endDate){
              this.task.beginDate = new Date(this.task.beginDate);
              this.task.endDate = new Date(this.task.endDate);
              this.f['beginDate'].setValue(this.task.beginDate);
              this.f['endDate'].setValue(this.task.endDate);
            }
            
            this.taskDetailService.getProjects()
              .subscribe({
                next: (project) => {
                  this.listOfProjects = project;
                }, error: error => {
                  this.listOfProjects = [] as Project[];
                  this.error = error;
                  this.loading = false;
                }
              })

            if(this.task.linkedProject){
              this.isTaskRelated = true;
            }
          },
          error: error => {
            this.task = {} as Task;
          }
        });

      },
      error: error => {
      }
    })
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

  invertValue(key : any) {
    if (this.checklist[key] == 'false'){
      this.checklist[key] = false
    } else if(this.checklist[key] == 'true'){
      this.checklist[key] = true
    }
    if((this.checklist[key] == false || this.checklist[key] == 'false') && !window.confirm("Are you sure that you want to complete the following task?")){
      return;
    }
      var filteredList = Object.keys(this.checklist).filter((item) => {
        return this.checklist[item] == false || this.checklist[item] == 'false'
      });
      if (filteredList.length >= 7 && (this.checklist[key] == true || this.checklist[key] == 'true')) {
        this.error = "The max number of unchecked items is 7";
        this.isOnCheckList = true;
        setTimeout(() => {this.error = ''
        }, 2*1000);
        return;
      }
      this.checklist[key] = !this.checklist[key]
      this.isOnCheckList = true;
      this.saveChanges()
  }

  addKey(key : any) {
    if (Object.keys(this.checklist).includes(key)) {
      this.error = "Item to create already exists";
      this.isOnCheckList = true;
      setTimeout(() => {this.error = ''
      }, 2*1000);
      return;
    } 
    if (key.length < 4) {
      this.error = "The item name must be at least 4 characters long";
      this.isOnCheckList = true;
      setTimeout(() => {this.error = ''
      }, 2*1000);
      return;
    }
    var filteredList = Object.keys(this.checklist).filter((item) => {
      return this.checklist[item] == false || this.checklist[item] == 'false'
    });
    if (filteredList.length >= 7) {
      this.error = "The max number of unchecked items is 7";
      this.isOnCheckList = true;
      setTimeout(() => {this.error = ''
      }, 2*1000);
      return;
    }
    if (this.checklist[key]) {
      this.error = "There already exists an item with that name";
      this.isOnCheckList = true;
      setTimeout(() => {this.error = ''
      }, 2*1000);
      return;
    }
    this.checklist[key] = false;
    this.isOnCheckList = true;
    this.saveChanges()
  }

  deleteKey(key : any) {
    delete this.checklist[key];
    this.isOnCheckList = true;
    this.saveChanges()
  }

  removeLinkedProjectOfTask(){
    this.f['project'].reset();
    this.task.linkedProject = {} as Project;
    this.isTaskRelated = false;
  }

  startShowingCheck() {
    if(this.showCheck){
      this.showCheck = false;
      return;
    } 
    this.showCheck = true;
  }

  onTabShowSelect(){
    if (!this.isMultiDropdownOpen){
      this.isMultiDropdownOpen = true;
    } else {
      this.isMultiDropdownOpen = false;
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 6,
      allowSearchFilter: true,
      defaultOpen: this.isMultiDropdownOpen
    };
  }
  
  hasChecklist() {
    // console.log("OBJECT HAS CHECKLIST")
    console.log(this.checklist);//keys())
    //console.log(Object.keys(this.checklist).length !== 0);
    return (Object.keys(this.checklist).length !== 0);
  }


  get f() { return this.form.controls; }



  keyPressNumbers(event : any) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  saveChanges() {
    console.log(this.checklist)
    if (this.f['beginDate'].value._d) {
      this.task.beginDate = new Date(this.f['beginDate'].value._d);
    }
    if (this.f['endDate'].value._d) {
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
    this.task.checklist = this.checklist;
    this.task.progress = this.f['progress'].value
    if(!this.f['project'].invalid && !this.isTaskRelated){
      this.task.linkedProject = this.f['project'].value
      this.isTaskRelated = true;
    }
    console.log("SAVING THIS")
    console.log(this.task)
    this.taskDetailService.saveTask(this.task).subscribe({
      next: (msg) => {
        this.error='';
        this.message = msg.msg;
        setTimeout(() => {        
          this.isOnCheckList = false;
          this.message = ''}, 2*1000);

      },
      error: error => {
        this.message = '';
        this.error = error;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/User';
import { Task } from 'src/app/Task';
import { TaskDetailService } from './task-detail.service';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  user = {} as User;
  task = {} as Task;
  users!: Observable<User[]>;
  userSelected = {} as User;
  message = ''
  error = ''
  term = ''
  private searchTerms = new Subject<string>();
  constructor(private taskDetailService: TaskDetailService, private route: ActivatedRoute, private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.user = this.taskDetailService.getUser();

    this.taskDetailService.getTaskDetail(id).subscribe({
      next: (task) => {
        this.task = task;
        console.log(this.task)
        this.taskDetailService.getUserById(task.userAssociated).subscribe((user) => {

          if (user == null)
            this.userSelected = {} as User;
          else
            this.userSelected = user;
        });
      },
      error: error => {
        this.task = {} as Task;
      }
    });
    this.users = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.searchUsers(term)),
    );

  }
  searchUsers(term: string): Observable<User[]> {
    this.userSelected = {} as User;
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<User[]>(`/api/usersByName/${term}`, this.httpOptions);
  }
  search(term: string): void {
    console.log(this.userSelected);
    this.searchTerms.next(term);
    this.userSelected = {} as User;
    this.term = term;
  }

  selectedUser(user: User) {
    this.userSelected = user;
  }

  saveChanges() {
    if (this.userSelected.id == this.task.userAssociated)
      return;
    if (this.userSelected != undefined && this.userSelected.id != this.task.userAssociated) {
      this.task.userAssociated = this.userSelected.id;

    }

    if (this.userSelected == undefined) {
      this.error = "Selecione um usuário válido";
      return;
    }
    let searchObj = {};
    if (this.userSelected.id == undefined) {
      searchObj = { term: this.term, task: this.task };
    } else searchObj = { task: this.task };
    console.log(searchObj)
    this.taskDetailService.saveTask(searchObj).subscribe({
      next: (message) => {
        this.message = message.msg;
      },
      error: error => {
        this.error = error;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/User';
import { TaskDetailService } from './task-detail.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  user = {} as User;
  constructor(private taskDetailService: TaskDetailService) { }

  ngOnInit(): void {
    this.user = this.taskDetailService.getUser();
  }

}

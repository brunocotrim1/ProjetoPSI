import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../../User';
import { Task } from '../../Task';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { UserPageService } from './user-page.service';
const colors: any = [
  {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
];
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})




export class UserPageComponent implements OnInit {

  user = {} as User;
  userLogged = {} as User;
  error: string | undefined;
  tasks: Task[] = [];
  events = [] as CalendarEvent[];
  constructor(private userPage: UserPageService, private http: HttpClient, private router: Router, private modal: NgbModal, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.userLogged = this.userPage.getUserLogged();

    const id = this.route.snapshot.paramMap.get('id')!;
    this.userPage.getUser(id).subscribe({
      next: (user) => {
        this.user = user
        this.userPage.getTaskList(this.user.id).subscribe({
          next: (tasks) => {
            this.tasks = tasks;
            for (let i = 0; i < this.tasks.length; i++) {
              tasks[i].beginDate = new Date(tasks[i].beginDate);
              tasks[i].endDate = new Date(tasks[i].endDate);
              this.events.push({
                start: tasks[i].beginDate,
                end: tasks[i].endDate,
                title: tasks[i].name,
                color: colors[Math.floor(Math.random() * colors.length)],
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
                draggable: false,
              });
            }
            this.refresh.next();

          },
          error: error => {
            this.error = error;
          }
        });
      },
      error: error => {
        this.error = error;
        this.router.navigate(["/"]);
      }
    });
  }




  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.events = this.events.filter((iEvent) => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];

  refresh = new Subject<void>();

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //   //  actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //    // actions: this.actions,
  //     draggable: true,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //  //   actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  activeDayIsOpen: boolean = true;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }


  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

}

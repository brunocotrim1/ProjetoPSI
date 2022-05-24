import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../User';
import { Task } from '../Task';
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
import { TeamCalendarService } from './team-calendar.service';
import { Team } from '../Team';
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
  selector: 'app-team-calendar',
  templateUrl: './team-calendar.component.html',
  styleUrls: ['./team-calendar.component.scss']
})
export class TeamCalendarComponent implements OnInit {

  user = {} as User;
  error: string | undefined;
  teams: Team[] = [];
  team: Team = {} as Team;
  events = [] as CalendarEvent[];
  constructor(private TeamCalendaService: TeamCalendarService, private http: HttpClient, private route: ActivatedRoute, private router: Router, private modal: NgbModal) { }
  ngOnInit(): void {




    const id = this.route.snapshot.paramMap.get('id')!;
    this.TeamCalendaService.getTeams().subscribe({
      next: (teams) => {
        for (let i = 0; i < teams.length; i++) {
          this.teams.push(teams[i]);
          if (teams[i]._id == id) {
            this.team = teams[i];
          }
        }

      },
      error: error => {
        this.error = error;
      }
    });
    this.TeamCalendaService.getTasks().subscribe({
      next: (tasks) => {
        for (let i = 0; i < tasks.length; i++) {

          for (let j = 0; j < tasks[i].usersAssigned.length; j++) {

            let match = false;
            for (let k = 0; k < this.team.members.length; k++) {

              if (tasks[i].usersAssigned[j] == this.team.members[k].id) {
                this.events.push({
                  title: tasks[i].name,
                  start: new Date(tasks[i].beginDate),
                  end: new Date(tasks[i].endDate),
                  color: colors[Math.floor(Math.random() * colors.length)],
                  draggable: true,
                  resizable: {
                    beforeStart: true,
                    afterEnd: true,
                  },
                });
                match = true;
                break;
              }
            }
            if (match) {
              break;
            }
          }
        }
        this.refresh.next();
      },
      error: error => {
        this.error = error;
      }
    });
    this.TeamCalendaService.getUnavailables().subscribe({
      next: (unavailables) => {
        for (let i = 0; i < this.team.members.length; i++) {
          for (let j = 0; j < unavailables.length; j++) {
            if (this.team.members[i].id == unavailables[j].user) {
              this.events.push({
                title: 'Indisponível',
                start: new Date(unavailables[j].beginDate),
                end: new Date(unavailables[j].endDate),
                color: colors[Math.floor(Math.random() * colors.length)],
                draggable: true,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
              });
            }
          }
        }

        this.refresh.next();

      },
      error: error => {
        this.error = error;
      }
    });


    this.TeamCalendaService.getReunions().subscribe({
      next: (reunions) => {
        for (let i = 0; i < reunions.length; i++) {
          if (reunions[i].possibleTeam == id) {
            this.events.push({
              title: 'Reunião desta Equipa',
              start: new Date(reunions[i].beginDate),
              end: new Date(reunions[i].endDate),
              color: colors[Math.floor(Math.random() * colors.length)],
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            });
          } else {
            for (let j = 0; j < reunions[i].members.length; j++) {
              for (let k = 0; k < this.team.members.length; k++) {
                if (reunions[i].members[j] == this.team.members[k].id) {
                  let nome = "Reuniao de um membro desta Equipa"
                  if (reunions[i].possibleTeam)
                    nome = "Reuniao de outra Equipa"
                    this.events.push({
                    title: nome,
                    start: new Date(reunions[i].beginDate),
                    end: new Date(reunions[i].endDate),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    draggable: true,
                    resizable: {
                      beforeStart: true,
                      afterEnd: true,
                    },
                  });
                  break;
                }
              }
            }

          }
        }


        this.refresh.next();

      },
      error: error => {
        this.error = error;
      }
    });

    this.user = this.TeamCalendaService.getUser();
    if (this.user == undefined)
      this.router.navigate(["/"]);
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

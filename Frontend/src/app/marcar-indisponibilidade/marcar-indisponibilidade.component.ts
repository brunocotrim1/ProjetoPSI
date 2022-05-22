import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import {Unavailability} from '../Unavailabilty';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-marcar-indisponibilidade',
  templateUrl: './marcar-indisponibilidade.component.html',
  styleUrls: ['./marcar-indisponibilidade.component.scss']
})
export class MarcarIndisponibilidadeComponent implements OnInit {
  dates = new FormGroup(
    {
      day: new FormControl('', [Validators.required]),
    }
  );
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  user = {} as User;
  ngOnInit(): void {
    this.user = this.getUser()
  }
  model: NgbDateStruct | undefined;
  time = { hour: 13, minute: 30 }
  time2 = { hour: 14, minute: 30 }
  error = ""
  message = ""
  onSubmit() {
    this.message = ""
    this.error = ""
    if (!this.f["day"].value) {
      this.error = "Por favor, preencha o campo de data"
      return
    }
    let date = new Date(this.f["day"].value.year, this.f["day"].value.month - 1, this.f["day"].value.day)
    let dataInicio = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.time.hour, this.time.minute)
    let dataInicio2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.time2.hour, this.time2.minute)
    if(dataInicio.getTime() >= dataInicio2.getTime()){
      this.error = "A data de início tem de ser anterior à data de fim"
      return
    }
    let indisponibilidade = {} as Unavailability
    indisponibilidade.user = this.user.id
    indisponibilidade.beginDate = dataInicio
    indisponibilidade.endDate = dataInicio2
    console.log(indisponibilidade)
    this.createUnavailability(indisponibilidade).subscribe({
      next: () => {
        this.message = "New Unavailability created!";
        setTimeout(() => {this.message = ''
      }, 2*1000);
      },
      error: error => {
        this.error = error;
        setTimeout(() => {this.error = ''
        }, 2*1000);
      }
    });
  }
  get f() {
    return this.dates.controls;
  }
  getUser(): User {
    const user = this.authenticationService.loadUser();
    if (user)
      return user
    else
      return {} as User
  }
  createUnavailability(unavailable:Unavailability): Observable<any>{
    console.log("called service")
    return this.http.post<any>(`/api/createunavailability`, unavailable, this.httpOptions);
  }
}

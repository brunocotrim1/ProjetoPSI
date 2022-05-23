import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { CreateProjectService } from './createproject.service';
import Validation from './validation';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  projectForm = new FormGroup(
    {
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9]+$/i)]),
    acronym: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9]{3}$/i)]),
    beginDate: new FormControl('',[Validators.required]),
    endDate: new FormControl('',[]),
    }
  );

  model: NgbDateStruct | undefined;
  model1: NgbDateStruct | undefined;

  defaultrole = "USER";
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  returnmessage = '';
  date !: Date;
  @ViewChild('picker') picker: any;
  @ViewChild('picker') picker2: any;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: Date;
  public maxDate!: Date;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'warn';
  public disableMinute = false;
  public hideTime = false;

  beforeCurrentDate = false;
  afterFinalDate = false;

  user = {} as User;

  constructor(
    private formBuilder: FormBuilder,
    private createuprojectservice: CreateProjectService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.loadUser()!;
  }

  get f() { 
    return this.projectForm.controls; 
  }

  onSubmit() {
    this.submitted = true;

    this.date = new Date();
    this.date.setMinutes(this.date.getMinutes() - 1);
    
    // if(this.f["beginDate"].value._d < this.date) {
    //   this.f['beginDate'].setErrors({'notValidWithCurrentDate': true});
    // }

    // if(this.f["endDate"].value._d !== null) {
    //   if(this.f["endDate"].value._d < this.f["beginDate"].value._d)  {
    //     this.f['endDate'].setErrors({'incorrect': true});
    //   }
    // }

    var InitialDate = new Date(this.f["beginDate"].value.year,this.f["beginDate"].value.month-1,this.f["beginDate"].value.day)
    var FinalDate = new Date(this.f["endDate"].value.year,this.f["endDate"].value.month-1,this.f["endDate"].value.day)

    if(InitialDate < new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate())) {
      this.f['beginDate'].setErrors({'beforeCurrentDate': true});
    }

    if(FinalDate < InitialDate)  {
      this.f['endDate'].setErrors({'afterFinalDate': true});
    }

    if (this.projectForm.invalid) {
      return;
    }

    this.loading = true;

    this.createuprojectservice.createProject(this.f["name"].value, this.f["acronym"].value, InitialDate, FinalDate)
      .subscribe({
        next: () => {
          this.returnmessage = "New project created!";
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
    this.projectForm.reset();
  }

}

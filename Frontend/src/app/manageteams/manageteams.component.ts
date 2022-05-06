import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../User';
import { ManageTeamsService } from '../services/manage-teams.service';
import Validation from '../createuser/validation';
import { Team } from '../Team';


@Component({
  selector: 'app-manageteams',
  templateUrl: './manageteams.component.html',
  styleUrls: ['./manageteams.component.scss']
})
export class ManageteamsComponent implements OnInit {

  user = {} as User;
  userget = {} as User;
  findUser : boolean = false;
  error = ""
  message = ""
  username = ""

  allusers = {} as User[];

  teamsbody : boolean = true;
  addbody : boolean = false;
  rembody : boolean= false;
  submitted : boolean = false;
  loading : boolean = false;
  userbelong : boolean = false;

  listOfTeams = {} as Team[];
  currTeam = {} as Team;

  userForm = new FormGroup(
    {
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9]+$/i)]),
    role: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required)
    }, {
      validators: [Validation.match('password', 'confirm_password')]
    }
  );


  //nameFirstTeam : number = 5;

  constructor(private authenticationService: AuthenticationService, 
    private manageteamsservice : ManageTeamsService) {
    
   }

  ngOnInit(): void {
    //console.log(this.manageteamsservice.getTeam1);
    this.user = this.authenticationService.loadUser()!;
    this.manageteamsservice.getTeams()
        .subscribe({
          next: (teams) => {
            this.listOfTeams = teams;
            console.log("Teams getted : " + this.listOfTeams.length)
          },
          error: error => {
            this.listOfTeams = {} as Team[];
            this.loading = false;
            console.log("Teams not getted : " + this.listOfTeams.length)
          }
        });
      this.manageteamsservice.getUsers()
      .subscribe({
        next: (users) => {
          console.log(users);
          this.allusers = users;
          console.log(this.allusers)
        },
        error: error => {
          this.allusers = {} as User[];
          this.loading = false;
          console.log(this.allusers);
        }
      });
    
  }
  
  logout() {
    this.authenticationService.logout();
  }

  setTeamsBody(b : boolean) {
    this.teamsbody = true;
    this.addbody = false;
    this.rembody = false;
  }

  setAddBody(b : boolean, currTeam : Team) {
    this.currTeam = currTeam;
    this.teamsbody = false;
    this.addbody = true;
    //this.saveChanges(true,"joao");
    //console.log("AddBody: " + this.addbody);
  }

  setRemBody(b : boolean, currTeam : Team) {
    this.currTeam = currTeam;
    this.teamsbody = false;
    this.rembody = true;
    //this.saveChanges(false,"bruno");
    //console.log(this.teamsbody);
  }

  updateTeam() {

  }
  
  //setAddRemMenu()

  saveChanges(add : boolean) {
    this.error = "";
    this.username = this.f["username"].value;
    //Falta lançar erros, mas por enquanto quero ver se funciona
    if(add) {
      this.currTeam.members.forEach((m) => {
        if(m.username === this.username) {
          this.error = "This user already belongs to the team";
        }
      })
      if(this.error !== "") {
        return;
      }
      console.log(this.setUserGet(this.username));
      if(this.findUser) {
        this.currTeam.members.push(this.userget);
        this.manageteamsservice.updateTeam(this.currTeam._id,this.currTeam.members).subscribe({
          next : () => {

          },
          error: error => {
            console.log(error);
            //this.loading = false;
          }
        });
        console.log(this.currTeam.members);
        this.findUser = false;
      }
      else {
        this.error = "User does not exist";
      }
    }
    else { 
      this.currTeam.members.forEach((m) => {
        if(m.username === this.username) this.userbelong = true;
      })
      if(this.userbelong) {
        this.currTeam.members.forEach((m,index) => {
          if(m.username === this.username) this.currTeam.members.splice(this.getIndex(),1);
          this.manageteamsservice.updateTeam(this.currTeam._id,this.currTeam.members).subscribe({
            next : () => {
  
            },
            error: error => {
              console.log(error);
            }
          });
          console.log("User removed sucessfully");
          this.userbelong = false;
          return;
        });
      }
      else {
        this.error = "The user does belong to the team";
      }
      
      console.log(this.currTeam.members);
    }

    if(this.error !== "") {
      
    }
    else {
      this.addbody = false;
      this.rembody = false;
      this.teamsbody = true;
    }
    
  }

  get f() { 
    return this.userForm.controls; 
  }

  setUserGet(username : String){
      this.allusers.forEach((u) => {
        if(u.username === username) {
          this.userget = u;
          this.findUser = true;
        }
      });
  }

  getIndex() {
    return this.currTeam.members.findIndex(m => {
      return m.username === this.username;
    })
  }

  onSubmit() {}

}

import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { CreateTeamService } from '../services/create-team.service';
import { User } from '../User';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss']
})
export class MultiselectDropdownComponent implements OnInit {

  constructor(private create_team_service: CreateTeamService) { }
  @Input()
    items!: string;

  dropdownList: any[] = [];
  

  fillInDropdown(typeobject : string) {
    if(typeobject === "Project") {
      //ir fazer getallprojects do service do project
    } else if(typeobject === "Team") {
      this.dropdownList = [];
      this.create_team_service.getAllUsers().subscribe(
          userList => {
            this.dropdownList = [...userList].map(x => x.username);
          }
        );
    }
  } 

  dropdownSettings: IDropdownSettings={};
  ngOnInit() {
    this.fillInDropdown("Team") 
    this.dropdownSettings = {
      idField: 'item_id' ,
      textField: 'item_text',
    };
  }
}

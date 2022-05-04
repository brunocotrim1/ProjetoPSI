import { Component, Input, OnInit } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { CreateTeamService } from '../services/create-team.service';

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

      //ir fazer getallmembers do service do team
      this.dropdownList = [];
    
      let users = this.create_team_service.getMembers();
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        this.dropdownList.push({ item_id: user.id, item_text: user.username});
      }

    }
    
  } 

  dropdownSettings: IDropdownSettings={};
  ngOnInit() {
    this.dropdownList = [];
    
    let users = this.create_team_service.getMembers();
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      this.dropdownList.push({ item_id: user.id, item_text: user.username});
    }
    console.log(this.dropdownList);
    this.dropdownSettings = {
      idField: 'item_id' ,
      textField: 'item_text',
    };
  }
}

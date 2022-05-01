import { Component, Input, OnInit } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss']
})
export class MultiselectDropdownComponent implements OnInit {

  @Input()
    items!: string;

  dropdownList: any[] = [];

  fillInDropdown(typeobject : string) {
    if(typeobject === "Project") {
      //ir fazer getallprojects do service do project
    } else if(typeobject === "Team") {
      //ir fazer getallprojects do service do project
    }
    //...
  } 

  dropdownSettings: IDropdownSettings={};
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1 , item_text: 'Item1' },
      { item_id: 2, item_text: 'Item2' },
      { item_id: 3, item_text: 'Item3' },
      { item_id: 4, item_text: 'Item4' },
      { item_id: 5, item_text: 'Item5' }
    ];
    this.dropdownSettings = {
      idField: 'item_id' ,
      textField: 'item_text',
    };
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulereunionteamComponent } from './schedulereunionteam.component';

describe('SchedulereunionComponent', () => {
  let component: SchedulereunionteamComponent;
  let fixture: ComponentFixture<SchedulereunionteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulereunionteamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulereunionteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

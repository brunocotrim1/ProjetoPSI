import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulereunionComponent } from './schedulereunion.component';

describe('SchedulereunionComponent', () => {
  let component: SchedulereunionComponent;
  let fixture: ComponentFixture<SchedulereunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulereunionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulereunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

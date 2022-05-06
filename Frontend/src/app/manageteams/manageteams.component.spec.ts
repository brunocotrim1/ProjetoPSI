import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageteamsComponent } from './manageteams.component';

describe('ManageteamsComponent', () => {
  let component: ManageteamsComponent;
  let fixture: ComponentFixture<ManageteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageteamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

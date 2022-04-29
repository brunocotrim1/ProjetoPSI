import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkprojectstoteamsComponent } from './linkprojectstoteams.component';

describe('LinkprojectstoteamsComponent', () => {
  let component: LinkprojectstoteamsComponent;
  let fixture: ComponentFixture<LinkprojectstoteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkprojectstoteamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkprojectstoteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

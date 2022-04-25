import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarEquipasComponent } from './criar-equipas.component';

describe('CriarEquipasComponent', () => {
  let component: CriarEquipasComponent;
  let fixture: ComponentFixture<CriarEquipasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriarEquipasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarEquipasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

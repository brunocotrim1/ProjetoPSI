import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcarIndisponibilidadeComponent } from './marcar-indisponibilidade.component';

describe('MarcarIndisponibilidadeComponent', () => {
  let component: MarcarIndisponibilidadeComponent;
  let fixture: ComponentFixture<MarcarIndisponibilidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcarIndisponibilidadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcarIndisponibilidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

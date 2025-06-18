import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitListTableComponent } from './permit-list-table.component';

describe('PermitListTableComponent', () => {
  let component: PermitListTableComponent;
  let fixture: ComponentFixture<PermitListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

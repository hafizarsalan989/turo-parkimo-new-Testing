import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaseCarListComponent } from './chase-car-list.component';

describe('ChaseCarListComponent', () => {
  let component: ChaseCarListComponent;
  let fixture: ComponentFixture<ChaseCarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChaseCarListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChaseCarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

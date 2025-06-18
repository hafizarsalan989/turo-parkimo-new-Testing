import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaseCarComponent } from './chase-car.component';

describe('ChaseCarComponent', () => {
  let component: ChaseCarComponent;
  let fixture: ComponentFixture<ChaseCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChaseCarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChaseCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

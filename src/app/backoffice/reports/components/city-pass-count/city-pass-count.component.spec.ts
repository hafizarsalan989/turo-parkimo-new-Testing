import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityPassCountComponent } from './city-pass-count.component';

describe('CityPassCountComponent', () => {
  let component: CityPassCountComponent;
  let fixture: ComponentFixture<CityPassCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityPassCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityPassCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaterangePickerComponent } from './daterange-picker.component';

describe('DaterangePickerComponent', () => {
  let component: DaterangePickerComponent;
  let fixture: ComponentFixture<DaterangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaterangePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaterangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

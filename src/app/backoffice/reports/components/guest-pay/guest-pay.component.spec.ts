import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPayComponent } from './guest-pay.component';

describe('GuestPayComponent', () => {
  let component: GuestPayComponent;
  let fixture: ComponentFixture<GuestPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

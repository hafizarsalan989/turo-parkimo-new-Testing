import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTagMailerComponent } from './print-tag-mailer.component';

describe('PrintTagMailerComponent', () => {
  let component: PrintTagMailerComponent;
  let fixture: ComponentFixture<PrintTagMailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintTagMailerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintTagMailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

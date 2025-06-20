import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueViewComponent } from './queue-view.component';

describe('QueueViewComponent', () => {
  let component: QueueViewComponent;
  let fixture: ComponentFixture<QueueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

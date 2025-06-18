import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCenterListComponent } from './message-center-list.component';

describe('MessageCenterListComponent', () => {
  let component: MessageCenterListComponent;
  let fixture: ComponentFixture<MessageCenterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageCenterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

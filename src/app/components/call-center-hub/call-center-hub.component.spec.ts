import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterHubComponent } from './call-center-hub.component';

describe('CallCenterHubComponent', () => {
  let component: CallCenterHubComponent;
  let fixture: ComponentFixture<CallCenterHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallCenterHubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallCenterHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

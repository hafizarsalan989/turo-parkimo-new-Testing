import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitReplaceTagModalComponent } from './permit-replace-tag-modal.component';

describe('PermitReplaceTagModalComponent', () => {
  let component: PermitReplaceTagModalComponent;
  let fixture: ComponentFixture<PermitReplaceTagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitReplaceTagModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitReplaceTagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

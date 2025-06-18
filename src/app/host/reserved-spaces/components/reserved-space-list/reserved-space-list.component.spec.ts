import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedSpaceListComponent } from './reserved-space-list.component';

describe('ReservedSpaceListComponent', () => {
  let component: ReservedSpaceListComponent;
  let fixture: ComponentFixture<ReservedSpaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservedSpaceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservedSpaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

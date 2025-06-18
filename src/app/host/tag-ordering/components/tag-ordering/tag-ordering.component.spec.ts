import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagOrderingComponent } from './tag-ordering.component';

describe('TagOrderingComponent', () => {
  let component: TagOrderingComponent;
  let fixture: ComponentFixture<TagOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagOrderingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

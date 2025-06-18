import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagShippingComponent } from './tag-shipping.component';

describe('TagShippingComponent', () => {
  let component: TagShippingComponent;
  let fixture: ComponentFixture<TagShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagShippingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

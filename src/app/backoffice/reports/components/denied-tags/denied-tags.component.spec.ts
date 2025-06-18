import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedTagsComponent } from './denied-tags.component';

describe('DeniedTagsComponent', () => {
  let component: DeniedTagsComponent;
  let fixture: ComponentFixture<DeniedTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeniedTagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagMasterExportsListComponent } from './tag-master-exports-list.component';

describe('TagMasterExportsListComponent', () => {
  let component: TagMasterExportsListComponent;
  let fixture: ComponentFixture<TagMasterExportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagMasterExportsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagMasterExportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

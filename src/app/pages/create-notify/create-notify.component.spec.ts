import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotifyComponent } from './create-notify.component';

describe('CreateNotifyComponent', () => {
  let component: CreateNotifyComponent;
  let fixture: ComponentFixture<CreateNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

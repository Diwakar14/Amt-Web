import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTicketComponent } from './ongoing-ticket.component';

describe('OngoingTicketComponent', () => {
  let component: OngoingTicketComponent;
  let fixture: ComponentFixture<OngoingTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

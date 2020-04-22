import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTicketCardComponent } from './client-ticket-card.component';

describe('ClientTicketCardComponent', () => {
  let component: ClientTicketCardComponent;
  let fixture: ComponentFixture<ClientTicketCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTicketCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTicketCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

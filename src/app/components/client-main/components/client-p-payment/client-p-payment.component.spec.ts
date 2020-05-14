import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPPaymentComponent } from './client-p-payment.component';

describe('ClientPPaymentComponent', () => {
  let component: ClientPPaymentComponent;
  let fixture: ComponentFixture<ClientPPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

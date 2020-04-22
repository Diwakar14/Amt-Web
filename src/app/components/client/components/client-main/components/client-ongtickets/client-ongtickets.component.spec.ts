import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOngticketsComponent } from './client-ongtickets.component';

describe('ClientOngticketsComponent', () => {
  let component: ClientOngticketsComponent;
  let fixture: ComponentFixture<ClientOngticketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientOngticketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOngticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

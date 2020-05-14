import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSerCatComponent } from './create-ser-cat.component';

describe('CreateSerCatComponent', () => {
  let component: CreateSerCatComponent;
  let fixture: ComponentFixture<CreateSerCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSerCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSerCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

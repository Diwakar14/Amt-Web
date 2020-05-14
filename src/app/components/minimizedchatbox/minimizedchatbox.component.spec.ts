import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimizedchatboxComponent } from './minimizedchatbox.component';

describe('MinimizedchatboxComponent', () => {
  let component: MinimizedchatboxComponent;
  let fixture: ComponentFixture<MinimizedchatboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimizedchatboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimizedchatboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

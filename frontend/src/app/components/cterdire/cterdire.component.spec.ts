import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CterdireComponent } from './cterdire.component';

describe('CterdireComponent', () => {
  let component: CterdireComponent;
  let fixture: ComponentFixture<CterdireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CterdireComponent]
    });
    fixture = TestBed.createComponent(CterdireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

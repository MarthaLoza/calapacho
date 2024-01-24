import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionComponent } from './RemisionComponent';

describe('RemisionComponent', () => {
  let component: RemisionComponent;
  let fixture: ComponentFixture<RemisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemisionComponent]
    });
    fixture = TestBed.createComponent(RemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

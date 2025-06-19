import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsContainerComponent } from './alerts-container.component';

describe('AlertsContainerComponent', () => {
  let component: AlertsContainerComponent;
  let fixture: ComponentFixture<AlertsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

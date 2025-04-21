import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TDSGraphComponent } from './tds-graph.component';

describe('TdsGraphComponent', () => {
  let component: TDSGraphComponent;
  let fixture: ComponentFixture<TDSGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TDSGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TDSGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

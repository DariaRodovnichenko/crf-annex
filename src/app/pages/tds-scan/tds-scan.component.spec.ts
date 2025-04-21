import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSScanComponent } from './tds-scan.component';

describe('TdsScanComponent', () => {
  let component: TDSScanComponent;
  let fixture: ComponentFixture<TDSScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TDSScanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TDSScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

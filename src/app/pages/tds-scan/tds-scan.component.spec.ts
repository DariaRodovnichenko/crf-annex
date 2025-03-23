import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsScanComponent } from './tds-scan.component';

describe('TdsScanComponent', () => {
  let component: TdsScanComponent;
  let fixture: ComponentFixture<TdsScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdsScanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

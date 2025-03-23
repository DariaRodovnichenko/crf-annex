import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrinderComponent } from './grinder.component';

describe('GrinderComponent', () => {
  let component: GrinderComponent;
  let fixture: ComponentFixture<GrinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrinderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

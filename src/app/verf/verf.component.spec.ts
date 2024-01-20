import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfComponent } from './verf.component';

describe('VerfComponent', () => {
  let component: VerfComponent;
  let fixture: ComponentFixture<VerfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

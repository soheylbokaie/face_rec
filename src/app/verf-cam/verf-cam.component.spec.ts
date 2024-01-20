import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfCamComponent } from './verf-cam.component';

describe('VerfCamComponent', () => {
  let component: VerfCamComponent;
  let fixture: ComponentFixture<VerfCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfCamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerfCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

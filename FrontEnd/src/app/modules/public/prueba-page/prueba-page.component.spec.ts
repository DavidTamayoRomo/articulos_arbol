import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaPageComponent } from './prueba-page.component';

describe('PruebaPageComponent', () => {
  let component: PruebaPageComponent;
  let fixture: ComponentFixture<PruebaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PruebaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

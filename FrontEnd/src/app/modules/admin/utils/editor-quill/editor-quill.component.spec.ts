import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorQuillComponent } from './editor-quill.component';

describe('EditorQuillComponent', () => {
  let component: EditorQuillComponent;
  let fixture: ComponentFixture<EditorQuillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorQuillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

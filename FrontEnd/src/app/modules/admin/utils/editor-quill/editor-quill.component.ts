import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { toDoc, toHTML } from 'ngx-editor';
@Component({
  selector: 'app-editor-quill',
  standalone: true,
  imports: [QuillModule, FormsModule],
  templateUrl: './editor-quill.component.html',
  styleUrl: './editor-quill.component.scss'
})
export class EditorQuillComponent {
  @Output() contentChanged = new EventEmitter<string>();
  @Input() message!: any;
  currentValue: any;

  editorContent = '';

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      /* [{ 'header': 1 }, { 'header': 2 }],  */              // custom button values
      [{ 'script': 'super' }], // superscript/subscript
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      /* [{ 'direction': 'rtl' }], */                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      /* [{ 'header': [1, 2, 3, 4, 5, 6, false] }], */

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image']
    ],/* 
    clipboard: {
      matchVisual: false // Ensure no visual matching on clipboard operations
    } */
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message']) {
      console.log('cambie de estado');
      this.currentValue = this.message;
    }

  }

  onContentChanged(event: any) {
    const html = event.html;
    const valor = toDoc(html);
    console.log(valor);
    this.contentChanged.emit(html);
  }

  ngOnDestroy() {
    console.log('EditorQuillComponent destroyed');
    // Aquí puedes realizar cualquier limpieza adicional que necesites
  }

}

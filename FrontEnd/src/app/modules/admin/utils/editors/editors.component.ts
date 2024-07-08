import { Component, EventEmitter, Input, NgModule, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar, toDoc  } from 'ngx-editor';

@Component({
    selector: 'app-editors',
    standalone: true,
    imports: [RouterLink, MatCardModule, NgxEditorModule, FormsModule],
    templateUrl: './editors.component.html',
    styleUrl: './editors.component.scss'
})
export class EditorsComponent {

    // Text Editor
    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    @Output() contentChanged = new EventEmitter<string>();
    @Input() message!: any;

    currentValue: any;

    ngOnInit(): void {
        this.editor = new Editor();

        this.editor.valueChanges.subscribe((value: any) => {
            this.contentChanged.emit(value);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['message']) {
            let html ='<font face="Arial">David tamayo romo&#160;</font><p><font face="Arial"><i>asdasdasdasdasd</i></font></p><p><font face="Arial"><i><u>asdasd</u></i></font></p><p>asdasasdasdasf<font face="Arial"><i><u><br></u></i></font></p><hr><font face="Times New Roman">asdas</font>'
            //this.currentValue =toDoc(html);
            this.currentValue = this.message;
        }
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
    }

}
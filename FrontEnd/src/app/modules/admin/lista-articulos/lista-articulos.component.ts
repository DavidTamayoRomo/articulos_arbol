import { NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EditorsComponent } from '../utils/editors/editors.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TwNestedNodesComponent } from '../utils/tw-nested-nodes/tw-nested-nodes.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { ArbolService } from '../services/arbol.service';
import { ArticuloService } from '../services/articulo.service';
import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, Packer, AlignmentType, UnderlineType } from "docx";
import { HasRoleDirective } from '../../../directives/has-role.directive';
import { KeycloakAuthService } from '../../../auth/services/keycloak-auth.service';
import { TextFromObjectPipe } from "../../../text-from-object.pipe";
import { Validators } from 'ngx-editor';
import { HttpClient } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HighlightPipe } from '../../../highlight.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/data.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


interface Node {
  id?: string;
  id_padre?: string | undefined;
  name: string;
  content?: string;
  content_transform?: string;
  state?: string;
  referencia?: string;
  children?: Node[];
  isVisible?: boolean;
  isExpanded?: boolean;
  usuario_creacion?: string;
  fecha_creacion?: Date;
  usuario_modificacion?: string;
  fecha_modificacion?: Date;
}

@Component({
  selector: 'app-lista-articulos',
  standalone: true,
  templateUrl: './lista-articulos.component.html',
  styleUrl: './lista-articulos.component.scss',
  imports: [
    MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, NgIf, MatCheckboxModule,
    MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule,
    RouterLinkActive, MatProgressBarModule, EditorsComponent, MatDialogModule, TwNestedNodesComponent, ReactiveFormsModule, MatTreeModule, HasRoleDirective, RouterModule,
    TextFromObjectPipe, HighlightPipe
  ]
})
export class ListaArticulosComponent {

  private fb = inject(FormBuilder);


  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Node>();
  dataSourceTree = new MatTreeNestedDataSource<Node>();
  selection = new SelectionModel<Node>(true, []);

  treeControl = new NestedTreeControl<Node>((node) => node.children);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // isToggled
  isToggled = false;

  //form!: FormGroup;

  // Popup Trigger
  classApplied = false;


  contenidoSeleccionado: Node;

  toggleClass() {
    this.classApplied = !this.classApplied;
  }
  toggleClass1() {
    this.classApplied1 = !this.classApplied1;
  }

  abrirEditar(element: Node) {
    this.contenidoSeleccionado = element;
    console.log(this.contenidoSeleccionado);
    this.toggleClass1();
    this.form.patchValue({
      titulo: element.name,
      contenido: element.content,
      estado: element.state,
      referencia: element.referencia,
    });
    this.parentMessage = element.content;
  }



  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  parentMessage: any;
  form!: FormGroup;

  content: any;

  classApplied1: boolean = false;

  constructor(
    public themeService: CustomizerSettingsService,
    public arbolService: ArbolService,
    public articuloService: ArticuloService,
    private keycloakauthService: KeycloakAuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dataService: DataService

  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }



  ngOnInit(): void {
    if (this.keycloakauthService.getRoles()) {
      if (this.keycloakauthService.getRoles().includes('Administrador')) {
        this.displayedColumns = ['contenido', 'estado', 'action'];
      } else {
        this.displayedColumns = ['contenido', 'action'];
      }
    } else {
      this.displayedColumns = ['titulo', 'contenido', 'estado'];
    }
    this.articuloService.getArticulos().subscribe({
      next: (data: any) => {
        this.dataSource.data = this.buildCompleteList(data);
      },
      error: (err) => { console.log("Error al cargar los Artículos") }
    });


    this.form = this.fb.group({
      titulo: [null, [Validators.required]],
      contenido: [null],
      estado: [null, [Validators.required]],
      referencia: [null],
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  hasChild = (_: number, node: Node) =>
    !!node.children && node.children.length > 0;


  exportToCSV() {
    let jsonData = {
      "name": "EJEMPLO 1",
      "content": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "align": "right"
            },
            "content": [
              {
                "type": "text",
                "text": "Este es un "
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "escrito"
              },
              {
                "type": "text",
                "text": " para "
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "em"
                  }
                ],
                "text": "probar"
              },
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "right"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "#0e8a16"
                    }
                  }
                ],
                "text": "el texto"
              },
              {
                "type": "text",
                "text": " html que se crea desde este "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "right"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "s"
                  }
                ],
                "text": "editor"
              }
            ]
          }
        ]
      },
      "state": "activo",
      "children": []
    };
    let csvContent = 'data:text/csv;charset=utf-8,';
    // Aquí agregas las cabeceras y el contenido al CSV. Por ejemplo:
    csvContent += "Name,Content\n"; // Cabeceras
    // Concatenar el contenido de texto. Este es un ejemplo muy básico.
    const textContent = jsonData.content.content.map((p: any) => p.content.map((c: any) => c.text).join('')).join('\n');
    csvContent += `${jsonData.name},"${textContent}"\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'example.csv');
  }

  exportToPDF() {
    let jsonData = this.dataSource.data;
    this.exportToPDFImport(jsonData);
  }

  exportToPDFImport(jsonData: any) {
    const docDefinition = this.jsonToDocDefinition(jsonData);
    pdfMake.createPdf(docDefinition).download("download.pdf");
  }

  jsonToDocDefinition(jsonData: any) {
    let content: any = [];

    jsonData.forEach((segment: any) => {
      if (segment.content && segment.content.type === 'doc' && segment.content.content) {
        content = content.concat(this.processContent(segment.content.content));
      }
    });

    return { content };
  }

  processContent(contentArray: any[]) {
    let result: any[] = [];

    contentArray.forEach((item: any) => {
      if (item.type === 'paragraph') {
        result.push(this.processParagraph(item));
      } else if (item.type === 'ordered_list') {
        result.push(this.processOrderedList(item));
      } else if (item.type === 'bullet_list') {
        result.push(this.processBulletList(item));
      } else if (item.type === 'blockquote') {
        result.push(this.processParagraph(item)); // Manejar como párrafo por simplicidad
      } else if (item.type === 'heading') {
        result.push(this.processHeading(item));
      }
    });

    return result;
  }

  processHeading(heading: any) {
    if (!heading.content) return {}; // Comprobación adicional para evitar errores

    let headingItems = heading.content.map((item: any) => {
      if (item.type === 'text') {
        let textBlock: any = { text: item.text };

        if (item.marks) {
          item.marks.forEach((mark: any) => {
            if (mark.type === 'strong') textBlock.bold = true;
            if (mark.type === 'em') textBlock.italics = true;
            if (mark.type === 'u') textBlock.decoration = 'underline';
            if (mark.type === 's') textBlock.decoration = 'lineThrough';
            if (mark.type === 'link') {
              textBlock.link = mark.attrs.href;
              textBlock.text = `<a href="${textBlock.link}">${textBlock.text}</a>`;  // Consider using HTML here only if necessary
            }
            if (mark.type === 'text_color') textBlock.color = mark.attrs.color;
            if (mark.type === 'text_background_color') textBlock.backgroundColor = mark.attrs.backgroundColor;
          });
        }

        return textBlock;
      }
      return null;
    }).filter((item: any) => item !== null);  // Filter out any null items

    // Determine header level and apply respective style
    const level = heading.attrs.level || 1;
    const tag = `h${Math.min(level, 6)}`;  // Ensure level is between 1 and 6

    return {
      text: headingItems,
      tag: tag,
      alignment: heading.attrs?.align || 'left', // Conditional check of alignment attribute
      margin: [0, 0, 0, 20] // Standard bottom margin
    };

  }

  processParagraph(paragraph: any) {
    if (!paragraph.content) return {}; // Comprobación adicional para evitar errores

    let paragraphItems = paragraph.content.map((item: any) => {
      if (item.type === 'text') {
        let textBlock: any = { text: item.text };

        if (item.marks) {
          item.marks.forEach((mark: any) => {
            if (mark.type === 'strong') textBlock.bold = true;
            if (mark.type === 'em') textBlock.italics = true;
            if (mark.type === 'u') textBlock.decoration = 'underline';
            if (mark.type === 's') textBlock.decoration = 'lineThrough';
            if (mark.type === 'link') textBlock.link = mark.attrs.href;
            if (mark.type === 'text_color') textBlock.color = mark.attrs.color;
            if (mark.type === 'text_background_color') textBlock.backgroundColor = mark.attrs.backgroundColor;
          });
        }

        return textBlock;
      }
    });

    return {
      text: paragraphItems,
      alignment: paragraph.attrs?.align || 'left', // Comprobación condicional de attrs
      margin: [0, 0, 0, 20] // Margen inferior
    };
  }

  processOrderedList(list: any) {
    return {
      ol: list.content.map((item: any) => this.processListItem(item)),
      margin: [0, 0, 0, 20]
    };
  }

  processBulletList(list: any) {
    return {
      ul: list.content.map((item: any) => this.processListItem(item)),
      margin: [0, 0, 0, 20]
    };
  }

  processListItem(item: any) {
    return this.processContent(item.content);
  }

  exportToDocx() {
    const jsonData: any = this.jsonToDocDefinition(this.dataSource.data);
    const doc = new Document({
      sections: [{
        children: this.createParagraphsFromData(jsonData.content)
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'trabajoMDMQ.docx');
    });

  }

  getAlignment(alignment: string) {
    switch (alignment) {
      case 'center':
        return AlignmentType.CENTER;
      case 'justify':
        return AlignmentType.JUSTIFIED;
      case 'right':
        return AlignmentType.RIGHT;
      default:
        return AlignmentType.LEFT;
    }
  }

  createParagraphsFromData(data: any[]): Paragraph[] {
    return data.map(item => {
      const marginAfter = item.margin && item.margin.length > 3 ? item.margin[3] * 20 : 0;
      const paragraph: any = new Paragraph({
        alignment: this.getAlignment(item.alignment),
        spacing: {
          after: marginAfter,  // Convierte el margen de píxeles a puntos
        }
      });
      item?.text?.forEach((part: any) => {
        const textRun = new TextRun({
          text: part.text,
          bold: part.bold || false,
          italics: part.italics || false,
          color: part.color || undefined,
          highlight: part.backgroundColor || undefined,
          underline: this.getUnderlineStyle(part.decoration),
          strike: part.decoration === "lineThrough",
          font: part.font || 'Arial',
          size: part.size || 24, // Tamaño predeterminado de 12pt
        });
        paragraph.addChildElement(textRun);
      });

      return paragraph;
    });
  }

  getUnderlineStyle(decoration: string | undefined): { type: any, color?: string } | undefined {
    if (decoration === "underline") {
      return { type: UnderlineType.SINGLE, color: "auto" };
    }
    return undefined;
  }

  processContentDoc(content: any) {
    return content.map((item: any) => {
      if (item.type === 'paragraph') {
        let paragraphChildren = item.content.map((subItem: any) => {
          let style: any = {};

          if (subItem.marks) {
            subItem.marks.forEach((mark: any) => {
              if (mark.type === 'strong') style.bold = true;
              if (mark.type === 'em') style.italic = true;
              if (mark.type === 'u') style.underline = true;
            });
          }

          return new TextRun({
            text: subItem.text,
            ...style,
          });
        });

        let alignment: any = AlignmentType.LEFT; // Alineación predeterminada

        if (item.attrs && item.attrs.align) {
          const align = item.attrs.align.toLowerCase();
          if (align === "right") alignment = AlignmentType.RIGHT;
          else if (align === "center") alignment = AlignmentType.CENTER;
          else if (align === "justify") alignment = AlignmentType.JUSTIFIED;
        }

        return new Paragraph({
          children: paragraphChildren,
          alignment: alignment,
        });
      } else if (item.type === 'ordered_list' || item.type === 'bullet_list') {
        return item.content.map((listItem: any) => this.processContentDoc(listItem.content)).flat();
      }
    }).flat();
  }

  openModal(element: Node) {
    this.classApplied = !this.classApplied;
    this.contenidoSeleccionado = element;
  }

  abrirHistorial() {
    if (this.keycloakauthService.getRoles().length > 0) {
      this.router.navigate(['/admin/contenido', this.contenidoSeleccionado.id]);
    } else {
      this.router.navigate(['/historial', this.contenidoSeleccionado.id]);
    }
  }

  handleVisibleNodes(visibleNodes: Node[]) {
    this.dataSource.data = this.buildCompleteList(visibleNodes);
    console.log("Transforamdo:; ", this.buildCompleteList(visibleNodes));
  }

  buildCompleteTree(nodes: Node[]): Node[] {
    // Si hay nodos hijos, construye el árbol recursivamente
    return nodes.map((node) => {
      if (node.children && node.children.length > 0) {
        console.log("TEngo hijos", node.children);
        node.children = this.buildCompleteTree(node.children); // Recurre en los nodos hijos
      }
      return node; // Devuelve el nodo, asegurando que los hijos estén correctamente construidos
    });
  }

  buildCompleteList(nodes: Node[]): Node[] {
    const completeList: Node[] = [];

    const traverseTree = (nodes: Node[]) => {
      nodes.forEach((node) => {
        if (!completeList.includes(node)) { // Evitar duplicaciones
          completeList.push(node); // Agrega el nodo a la lista
          if (node.children && node.children.length > 0) {
            traverseTree(node.children); // Recorre recursivamente los hijos
          }
        } else {
          console.warn("Nodo duplicado omitido:", node); // Avisar sobre posibles duplicaciones
        }
      });
    };

    traverseTree(nodes); // Inicia el recorrido

    return completeList; // Devuelve la lista completa con todos los nodos
  }

  abrirLink(url: string) {
    window.open('https://' + url);
  }


  handleEditorContentChanged(content: string) {
    this.content = content;
    console.log(content);
  }

  sendMessage() {
    this.dataService.changeMessage("Actualizar lista");
  }

  editar() {
    let datosKeycloak: any = this.keycloakauthService.getLoggedUser();
    let usuarioCreacion: any = datosKeycloak.preferred_username;

    const pipeTextFromObject = new TextFromObjectPipe();
    let objeto: Node = {
      name: this.form.value.titulo,
      content: this.content,
      content_transform: pipeTextFromObject.transform(this.content),
      state: this.form.value.estado,
      referencia: this.form.value.referencia,
      children: this.contenidoSeleccionado.children,
      id: this.contenidoSeleccionado.id,
      id_padre: this.contenidoSeleccionado.id_padre,
      fecha_modificacion: new Date(),
      usuario_modificacion: usuarioCreacion,
      fecha_creacion: this.contenidoSeleccionado.fecha_creacion,
      usuario_creacion: this.contenidoSeleccionado.usuario_creacion
    }
    if (this.form.valid && this.content) {
      //actualizar
      if (this.contenidoSeleccionado.id_padre != null) {
        this.articuloService.update(objeto, this.contenidoSeleccionado.id_padre, this.contenidoSeleccionado.id).subscribe({
          next: ((resp: any) => {
            this._snackBar.open('El registro seleccionado se actualizó con éxito', 'Cerrar', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.toggleClass1();
            this.articuloService.getArticulos().subscribe({
              next: (data: any) => {
                this.dataSource.data = this.buildCompleteList(data);
                this.sendMessage();
              },
              error: (err) => { console.log("Error al cargar los Artículos") }
            });


          }),
          error: ((err: any) => {
            console.log(err);
          })
        })
      } else {
        console.log(this.contenidoSeleccionado);
        this.articuloService.update(objeto, this.contenidoSeleccionado.id, this.contenidoSeleccionado.id).subscribe({
          next: ((resp: any) => {
            this._snackBar.open('El registro seleccionado se actualizó con éxito', 'Cerrar', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.toggleClass1();
            this.articuloService.getArticulos().subscribe({
              next: (data: any) => {
                this.dataSource.data = this.buildCompleteList(data);
                this.sendMessage();
              },
              error: (err) => { console.log("Error al cargar los Artículos") }
            });
          }),
          error: ((err: any) => {
            console.log(err);
          })
        })
      }
    }else{
      this._snackBar.open('Completar todos los campos obligatorios', 'Cerrar', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
    });
    }
  }
  /*  } */


  cambiarEstado(element: any) {
    let datosKeycloak: any = this.keycloakauthService.getLoggedUser();
    let usuarioCreacion: any = datosKeycloak.preferred_username;
    const pipeTextFromObject = new TextFromObjectPipe();
    let objeto: Node = {
      name: element.name,
      content: element.content,
      content_transform: pipeTextFromObject.transform(element.content),
      state: "Derogado",
      referencia: element.referencia,
      children: element.children,
      id: element.id,
      id_padre: element.id_padre,
      fecha_modificacion: new Date(),
      usuario_modificacion: usuarioCreacion,
      fecha_creacion: element.fecha_creacion,
      usuario_creacion: element.usuario_creacion
    }
    console.log(objeto);
    /* if (this.form.valid && this.content) { */
    //actualizar
    if (element.id_padre != null) {
      this.articuloService.update(objeto, element.id_padre, element.id).subscribe({
        next: ((resp: any) => {
          console.log(resp);
          this._snackBar.open('El registro seleccionado se actualizó con éxito', 'Cerrar', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.articuloService.getArticulos().subscribe({
            next: (data: any) => {
              console.log(data);
              console.log(this.buildCompleteList(data));//TODO: Verificar xq no se actualiza
              this.dataSource.data = this.buildCompleteList(data);
              this.dataSource.paginator = this.paginator;
            },
            error: (err) => { console.log("Error al cargar los Artículos") }
          });


        }),
        error: ((err: any) => {
          console.log(err);
        })
      })
    } else {
      this.articuloService.update(objeto, element.id, element.id).subscribe({
        next: ((resp: any) => {
          this.articuloService.getArticulos().subscribe({
            next: (data: any) => {
              this._snackBar.open('El registro seleccionado se actualizó con éxito', 'Cerrar', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
              console.log(data);
              console.log(this.buildCompleteList(data));//TODO: Verificar xq no se actualiza
              this.dataSource.data = this.buildCompleteList(data);
              this.dataSource.paginator = this.paginator;
            },
            error: (err) => { console.log("Error al cargar los Artículos") }
          });
        }),
        error: ((err: any) => {
          console.log(err);
        })
      })
    }
  }

}
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { HasRoleDirective } from '../../../directives/has-role.directive';
import { KeycloakAuthService } from '../../../auth/services/keycloak-auth.service';
import { TextFromObjectPipe } from "../../../text-from-object.pipe";
import { Validators } from 'ngx-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';

export interface PeriodicElement {
  taskName: string;
  taskID: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
  status: any;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    taskID: '#951',
    taskName: 'Hotel management system',
    assignedTo: 'Shawn Kennedy',
    dueDate: '15 Nov, 2024',
    priority: 'High',
    status: {
      inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#587',
    taskName: 'Send proposal to APR Ltd',
    assignedTo: 'Roberto Cruz',
    dueDate: '14 Nov, 2024',
    priority: 'Medium',
    status: {
      // inProgress: 'In Progress',
      pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#618',
    taskName: 'Python upgrade',
    assignedTo: 'Juli Johnson',
    dueDate: '13 Nov, 2024',
    priority: 'High',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#367',
    taskName: 'Schedule meeting with Daxa',
    assignedTo: 'Catalina Engles',
    dueDate: '12 Nov, 2024',
    priority: 'Low',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#761',
    taskName: 'Engineering lite touch',
    assignedTo: 'Louis Nagle',
    dueDate: '11 Nov, 2024',
    priority: 'Medium',
    status: {
      inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#431',
    taskName: 'Refund bill payment',
    assignedTo: 'Michael Marquez',
    dueDate: '10 Nov, 2024',
    priority: 'Low',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#421',
    taskName: 'Public beta release',
    assignedTo: 'James Andy',
    dueDate: '09 Nov, 2024',
    priority: 'High',
    status: {
      inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#624',
    taskName: 'Fix platform errors',
    assignedTo: 'Alina Smith',
    dueDate: '08 Nov, 2024',
    priority: 'Medium',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#513',
    taskName: 'Launch our mobile app',
    assignedTo: 'David Warner',
    dueDate: '07 Nov, 2024',
    priority: 'Low',
    status: {
      // inProgress: 'In Progress',
      pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  }
];

interface Node {
  id?: string;
  id_padre?: string | undefined;
  name: string;
  content?: string;
  state?: string;
  referencia?: string;
  children?: Node[];
  isVisible?: boolean;
  isExpanded?: boolean;
}

interface CategoriaNode {
  nombre: string;
  children?: CategoriaNode[];
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
    TextFromObjectPipe
  ]
})
export class ListaArticulosComponent {

  private fb = inject(FormBuilder);


  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Node>();
  dataSourceTree = new MatTreeNestedDataSource<Node>();
  selection = new SelectionModel<Node>(true, []);

  treeControl = new NestedTreeControl<Node>((node) => node.children);

  dataSource1 = new MatTreeNestedDataSource<CategoriaNode>();
  addNodeForm: FormGroup;

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
    this.parentMessage=element.content;
  }



  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  parentMessage:any;
  form!: FormGroup;

  content: any;

  classApplied1: boolean = false;

  constructor(
    public themeService: CustomizerSettingsService,
    public arbolService: ArbolService,
    public articuloService: ArticuloService,
    private keycloakauthService: KeycloakAuthService,
    private router: Router
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
        this.displayedColumns = ['contenido'];
      }
    } else {
      this.displayedColumns = ['titulo', 'contenido', 'estado'];
    }
    /*  this.displayedColumns = ['titulo', 'contenido', 'estado', 'action']; */
    this.articuloService.getArticulos().subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSource.data = this.buildCompleteList(data);
      },
      error: (err) => { console.log("Error al cargar los Artículos") }
    });

    this.dataSource1.data = [
      {
        nombre: 'Tecnología',
        children: [
          {
            nombre: 'Programación',
            children: [{ nombre: 'Bases de Datos', children: [] }],
          },
        ],
      },
    ];

    this.addNodeForm = this.fb.group({
      nombre: '',
      padre: '',
    });

    this.form = this.fb.group({
      titulo: [null, [Validators.required]],
      contenido: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      referencia: [null],
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  guardar() {
    /* console.log(this.form.value);
    console.log(this.form); */
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
    let jsonData =
    {
      "name": "segmento",
      "content": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "align": null
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "SECRETARÍA DEGOBIERNO DIGITAL Y TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "center"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "center"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "INFORME DE NECESIDAD"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "center"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "ADQUISICION DE LICENCIAMIENTO PARA LA ADMINISTRACIÓN DE LA SEGURIDAD DE LOS AMBIENTES DE DESARROLLO, PRUEBA Y PRODUCCIÓN DE DMQ."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "1.      ANTECEDENTES"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "La SECRETARÍA DEGOBIERNO DIGITAL Y TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES fue creada, a través de Resolución Nro. AQ 050-2022 de 08 de noviembre de 2022, y tiene como misión “Dirigir y coordinar la gestión de los proyectos y servicios de tecnología de información garantizando la integridad, disponibilidad, optimización de recursos, sistematización de los procesos institucionales del Municipio del distrito Metropolitano de Quito”."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Mediante resolución Nro. ADMQ 022-2023, de 14 de noviembre de 2023, el señor Alcalde Metropolitano, resolvió expedir la Estructura Organizacional del Gobierno Autónomo Descentralizado del Distrito Metropolitano de Quito. En el artículo 1 de la resolución en mención, se estableció como proceso adjetivo de nivel de asesoría a esta dependencia, con la denominación de “Secretaría de Gobierno Digital y Tecnologías de la Información y Comunicaciones”, integrada por las siguientes Direcciones:"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Sistemas de Información y Servicios Tecnológicos."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Proyectos Tecnológicos."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Infraestructura y Seguridad de TIC."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Gobierno Digital."
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "href": "#_msocom_1",
                      "title": null,
                      "target": null
                    }
                  }
                ],
                "text": "[OIRM1]"
              },
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "La SECRETARÍA DEGOBIERNO DIGITAL Y TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES, a través de la Dirección Metropolitana de Sistemas de Información y Servicios Tecnológicos tiene como misión “Gestionar los sistemas de información y los servicios tecnológicos del GAD del Distrito Metropolitano de Quito, que permitan brindar soluciones tecnológicas, a través de su análisis, implementación y mantenimiento asegurando su interoperabilidad.”"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Durante el presente año, la Secretaría de Gobierno Digital y Tecnologías de la Información y Comunicaciones (SGDTIC) del Distrito Metropolitano de Quito (DMQ) ha experimentado un incremento significativo en la demanda por servicios digitales que no solo sean accesibles, sino también eficientes. Este incremento subraya la importancia crítica de adoptar soluciones tecnológicas avanzadas que permitan una integración y gestión efectiva de los distintos sistemas tecnológicos existentes en el DMQ."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Conscientes de esta necesidad, se ha tomado la decisión de implementar herramientas de vanguardia, entre ellas, un orquestador de contenedores. Esta elección busca optimizar el rendimiento y la disponibilidad de los servicios digitales, proporcionando una infraestructura tecnológica que facilite la interconexión fluida entre las diversas plataformas y sistemas."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "La adopción de estas soluciones avanzadas es crucial para garantizar una administración eficaz y segura de los sistemas con arquitecturas modernas en el DMQ. Además, estas herramientas están diseñadas para mejorar significativamente la experiencia de los usuarios, asegurando que los servicios digitales se mantengan no solo a la vanguardia de la tecnología, sino también alineados con las necesidades cambiantes de la población."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Actualmente, la SGDTIC reconoce la falta de herramientas especializadas que faciliten la orquestación de sistemas de alta disponibilidad. Por ello, la implementación de un orquestador de contenedores se presenta como una solución estratégica para superar estos desafíos, marcando un paso adelante en la transformación digital y la eficiencia operativa del DMQ."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "2.      BASE LEGAL"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": "La Constitución de la República del Ecuador en su artículo 288 "
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "em"
                  },
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": "“Las compras públicas cumplirán con criterios de eficiencia, transparencia, calidad, responsabilidad ambiental y social. Se priorizarán los productos y servicios nacionales, en particular los provenientes de la economía popular y solidaria, y de las micro, pequeñas y medianas unidades productivas.”"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": "La Ley Orgánica del Sistema Nacional de Contratación Pública en sus artículos pertinentes preceptúa:"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "em"
                  }
                ],
                "text": "“Art. 23.-Estudios. - Antes de iniciar un procedimiento precontractual, de acuerdo a la naturaleza de la contratación, la entidad deberá contar con los estudios y diseños completos, definitivos y actualizados, planos y cálculos, especificaciones técnicas, debidamente aprobados por las instancias correspondientes, vinculados al Plan Anual de Contratación de la entidad.”"
              }
            ]
          },
          {
            "type": "horizontal_rule"
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": null
            },
            "content": [
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "href": "#_msoanchor_1",
                      "title": null,
                      "target": null
                    }
                  }
                ],
                "text": "[OIRM1]"
              },
              {
                "type": "text",
                "text": "Verificar atribuciones y competencias de conformidad a la resolución 007 2024."
              }
            ]
          }
        ]
      },
      "state": "activo",
      "children": []
    };

    this.exportPDF(jsonData);
  }

  exportPDF(jsonData: any) {
    const htmlContent = this.jsonToHTML(jsonData);
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2canvas(container).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);

      // Margen deseado en milímetros
      const margin = 10; // Por ejemplo, 10 mm de margen

      // Dimensiones ajustadas para incluir el margen
      const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Verificar si la altura ajustada con el ancho y el margen excede la altura de la página
      const pageHeight = pdf.internal.pageSize.getHeight() - (margin * 2); // Altura de la página ajustada para los márgenes superior e inferior
      const finalPdfHeight = pdfHeight > pageHeight ? pageHeight : pdfHeight; // Usar la menor de las dos alturas

      // Añadir la imagen al PDF con margen
      pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, finalPdfHeight);

      pdf.save("download.pdf");

      // Opcional: Elimina el contenedor para limpiar el DOM
      document.body.removeChild(container);
    });

  }

  jsonToHTML(jsonData: any) {
    let htmlContent = `<h1 style="text-align:center;">${jsonData.name}</h1>`;

    if (jsonData.content && jsonData.content.content && jsonData.content.content.forEach) {
      jsonData.content.content.forEach((paragraph: any) => {
        let align = paragraph.attrs && paragraph.attrs.align ? paragraph.attrs.align : 'left';
        htmlContent += `<p style="text-align: ${align};">`;

        if (paragraph.content && paragraph.content.forEach) {
          paragraph.content.forEach((part: any) => {
            let textStyle = '';
            if (part.marks && part.marks.forEach) {
              part.marks.forEach((mark: any) => {
                if (mark.type === 'strong') textStyle += '<strong>';
                if (mark.type === 'em') textStyle += '<em>';
                // Agrega aquí más comprobaciones para otros estilos
              });
            }
            let textEndStyle = textStyle.replace(/<strong>/g, '</strong>').replace(/<em>/g, '</em>'); // Cierra las etiquetas
            htmlContent += `${textStyle}${part.text}${textEndStyle}`;
          });
        }

        htmlContent += `</p>`;
      });
    }

    return htmlContent;
  }


  exportToDocx() {
    let jsonData = {
      "name": "segmento",
      "content": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "align": null
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "SECRETARÍA DEGOBIERNO DIGITAL Y TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "center"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "center"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "INFORME DE NECESIDAD"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "center"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "ADQUISICION DE LICENCIAMIENTO PARA LA ADMINISTRACIÓN DE LA SEGURIDAD DE LOS AMBIENTES DE DESARROLLO, PRUEBA Y PRODUCCIÓN DE DMQ."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "1.      ANTECEDENTES"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "La SECRETARÍA DEGOBIERNO DIGITAL Y TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES fue creada, a través de Resolución Nro. AQ 050-2022 de 08 de noviembre de 2022, y tiene como misión “Dirigir y coordinar la gestión de los proyectos y servicios de tecnología de información garantizando la integridad, disponibilidad, optimización de recursos, sistematización de los procesos institucionales del Municipio del distrito Metropolitano de Quito”."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Mediante resolución Nro. ADMQ 022-2023, de 14 de noviembre de 2023, el señor Alcalde Metropolitano, resolvió expedir la Estructura Organizacional del Gobierno Autónomo Descentralizado del Distrito Metropolitano de Quito. En el artículo 1 de la resolución en mención, se estableció como proceso adjetivo de nivel de asesoría a esta dependencia, con la denominación de “Secretaría de Gobierno Digital y Tecnologías de la Información y Comunicaciones”, integrada por las siguientes Direcciones:"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Sistemas de Información y Servicios Tecnológicos."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Proyectos Tecnológicos."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Infraestructura y Seguridad de TIC."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Dirección Metropolitana de Gobierno Digital."
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "href": "#_msocom_1",
                      "title": null,
                      "target": null
                    }
                  }
                ],
                "text": "[OIRM1]"
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
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "La SECRETARÍA DEGOBIERNO DIGITAL Y TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES, a través de la Dirección Metropolitana de Sistemas de Información y Servicios Tecnológicos tiene como misión “Gestionar los sistemas de información y los servicios tecnológicos del GAD del Distrito Metropolitano de Quito, que permitan brindar soluciones tecnológicas, a través de su análisis, implementación y mantenimiento asegurando su interoperabilidad.”"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Durante el presente año, la Secretaría de Gobierno Digital y Tecnologías de la Información y Comunicaciones (SGDTIC) del Distrito Metropolitano de Quito (DMQ) ha experimentado un incremento significativo en la demanda por servicios digitales que no solo sean accesibles, sino también eficientes. Este incremento subraya la importancia crítica de adoptar soluciones tecnológicas avanzadas que permitan una integración y gestión efectiva de los distintos sistemas tecnológicos existentes en el DMQ."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Conscientes de esta necesidad, se ha tomado la decisión de implementar herramientas de vanguardia, entre ellas, un orquestador de contenedores. Esta elección busca optimizar el rendimiento y la disponibilidad de los servicios digitales, proporcionando una infraestructura tecnológica que facilite la interconexión fluida entre las diversas plataformas y sistemas."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "La adopción de estas soluciones avanzadas es crucial para garantizar una administración eficaz y segura de los sistemas con arquitecturas modernas en el DMQ. Además, estas herramientas están diseñadas para mejorar significativamente la experiencia de los usuarios, asegurando que los servicios digitales se mantengan no solo a la vanguardia de la tecnología, sino también alineados con las necesidades cambiantes de la población."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": "Actualmente, la SGDTIC reconoce la falta de herramientas especializadas que faciliten la orquestación de sistemas de alta disponibilidad. Por ello, la implementación de un orquestador de contenedores se presenta como una solución estratégica para superar estos desafíos, marcando un paso adelante en la transformación digital y la eficiencia operativa del DMQ."
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "strong"
                  }
                ],
                "text": "2.      BASE LEGAL"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": "La Constitución de la República del Ecuador en su artículo 288 "
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "em"
                  },
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": "“Las compras públicas cumplirán con criterios de eficiencia, transparencia, calidad, responsabilidad ambiental y social. Se priorizarán los productos y servicios nacionales, en particular los provenientes de la economía popular y solidaria, y de las micro, pequeñas y medianas unidades productivas.”"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": "La Ley Orgánica del Sistema Nacional de Contratación Pública en sus artículos pertinentes preceptúa:"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "text_color",
                    "attrs": {
                      "color": "black"
                    }
                  }
                ],
                "text": " "
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": "justify"
            },
            "content": [
              {
                "type": "text",
                "marks": [
                  {
                    "type": "em"
                  }
                ],
                "text": "“Art. 23.-Estudios. - Antes de iniciar un procedimiento precontractual, de acuerdo a la naturaleza de la contratación, la entidad deberá contar con los estudios y diseños completos, definitivos y actualizados, planos y cálculos, especificaciones técnicas, debidamente aprobados por las instancias correspondientes, vinculados al Plan Anual de Contratación de la entidad.”"
              }
            ]
          },
          {
            "type": "horizontal_rule"
          },
          {
            "type": "paragraph",
            "attrs": {
              "align": null
            },
            "content": [
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "href": "#_msoanchor_1",
                      "title": null,
                      "target": null
                    }
                  }
                ],
                "text": "[OIRM1]"
              },
              {
                "type": "text",
                "text": "Verificar atribuciones y competencias de conformidad a la resolución 007 2024."
              }
            ]
          }
        ]
      },
      "state": "activo",
      "children": []
    }
    const doc = new Document({
      sections: [
        {
          children: jsonData.content?.content?.map((para) => { // Asegurar que jsonData.content.content es un arreglo
            const paragraphChildren = para.content?.map((content) => { // Similarmente para para.content
              let style: any = {};

              if (content.marks) {
                content.marks.forEach((mark) => {
                  if (mark.type === "strong") {
                    style.bold = true;
                  }
                  // Incluye aquí más lógica de estilos según necesites
                });
              }

              return new TextRun({
                text: content.text,
                ...style,
              });
            }) || []; // Fallback a arreglo vacío si para.content es undefined

            let alignment: any = "left"; // Valor predeterminado
            // Establece la alineación basada en para.attrs.align, si existe

            return new Paragraph({
              children: paragraphChildren,
              alignment: alignment,
            });
          }) || [], // Fallback a arreglo vacío si jsonData.content.content es undefined
        },
      ],
    });

    // Generar el documento y descargarlo
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${jsonData.name}.docx`);
    });
  }


  openModal(element: Node) {
    this.classApplied = !this.classApplied;
    this.contenidoSeleccionado = element;
  }

  abrirHistorial() {
    this.router.navigate(['/admin/contenido'])
  }

  handleVisibleNodes(visibleNodes: Node[]) {
    console.log("Recibido:", visibleNodes);
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
  }

  editar() {
    /* console.log(this.contenidoSeleccionado);
    console.log(this.form.value);
    console.log(this.content);
 */
    let objeto:Node = {
      name:this.form.value.titulo,
      content:this.content,
      state:this.form.value.estado,
      referencia:this.form.value.referencia,
      children:this.contenidoSeleccionado.children,
      id:this.contenidoSeleccionado.id,
      id_padre:this.contenidoSeleccionado.id_padre
    }

    /* if (this.form.valid && this.content) { */
      //actualizar
      if (this.contenidoSeleccionado.id_padre != null) {
        this.articuloService.update(objeto, this.contenidoSeleccionado.id_padre,  this.contenidoSeleccionado.id).subscribe({
          next: ((resp:any)=>{
            console.log(resp);
          }),
          error:((err:any)=>{
            console.log(err);
          })
        })
      }else{
        this.articuloService.update(objeto, this.contenidoSeleccionado.id,  this.contenidoSeleccionado.id).subscribe({
          next: ((resp:any)=>{
            console.log(resp);
          }),
          error:((err:any)=>{
            console.log(err);
          })
        })
      }
      
    }
 /*  } */


}
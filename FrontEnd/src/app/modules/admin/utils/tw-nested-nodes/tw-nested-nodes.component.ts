import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { Validators } from 'ngx-editor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditorsComponent } from '../editors/editors.component';
import { HasRoleDirective } from '../../../../directives/has-role.directive';
import { ArticuloService } from '../../services/articulo.service';
import { TextFromObjectPipe } from '../../../../text-from-object.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakAuthService } from '../../../../auth/services/keycloak-auth.service';
import { DataService } from '../../services/data.service';
import { EstadosService } from '../../services/estados.service';
import { EditorQuillComponent } from '../editor-quill/editor-quill.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Node {
    id?: string;
    name: string;
    content?: string;
    state?: string;
    referencia?: string;
    id_padre?: string;
    children?: Node[];
    content_transform?: string;
    isVisible?: boolean;
    isExpanded?: boolean;
    usuario_creacion?: string;
    fecha_creacion?: Date;
    usuario_modificacion?: string;
    fecha_modificacion?: Date;
}

@Component({
    selector: 'app-tw-nested-nodes',
    standalone: true,
    imports: [
        CommonModule,
        MatTreeModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        EditorsComponent,
        HasRoleDirective,
        EditorQuillComponent,
        MatProgressSpinnerModule
    ],
    templateUrl: './tw-nested-nodes.component.html',
    styleUrl: './tw-nested-nodes.component.scss'
})
export class TwNestedNodesComponent {
    showEditor = true;
    @Output() NodoSeleccionado = new EventEmitter<Node[]>();

    private dataChange = new BehaviorSubject<Node[]>([]);
    isLoading = true; // Estado de carga
    treeControl = new NestedTreeControl<Node>(node => node.children);
    dataSource = new MatTreeNestedDataSource<Node>();
    searchText = '';

    classApplied = false;
    datoSeleccionado: any;
    datoSeleccionadoGuardar: any;
    content: any;

    banderaPadre = false;

    form!: FormGroup;
    states: string[] = ['activo'];

    parentMessage: any = '';

    constructor(
        public themeService: CustomizerSettingsService,
        public articuloService: ArticuloService,
        private _snackBar: MatSnackBar,
        private keycloakauthService: KeycloakAuthService,
        private dataService: DataService,
        private estadosService: EstadosService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder // Cambié la inyección aquí en lugar de usar `inject(FormBuilder)`
    ) { }

    message: string;

    ngOnInit(): void {
        this.form = this.fb.group({
            titulo: [null, [Validators.required]],
            contenido: [null],
            estado: [null, [Validators.required]],
            referencia: [null],
        });
        this.obtenerTodosEstados(['activo']);
        this.dataService.currentMessage.subscribe(message => {
            this.message = message;
            console.log(this.message);
            this.searchText = '';
            this.obtenerTodosEstados(this.states);
        });

        this.estadosService.currentMessage.subscribe((message: string[]) => {
            this.obtenerTodosEstados(message);
            this.states = message;
        })
    }

    obtenerTodosEstados(lista: string[]) {
        this.isLoading = true; // Activar el estado de carga
        this.articuloService.getArticulosByState(lista).subscribe({
            next: (data: any) => {
                console.log(data);
                this.dataSource.data = data;
                this.dataChange.next(data);
                this.resetTree();
                setTimeout(() => {
                    this.isLoading = false;
                }, 1000);

            },
            error: (err) => {
                console.log("Error al cargar los Artículos");
                this.isLoading = false;
            }
        });
    }

    hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

    logNodeData(node: any) {
        console.log(node);
        this.NodoSeleccionado.emit([node]);
    }

    search() {
        const searchText = this.searchText.toLowerCase();
        this.resetTree();

        if (searchText) {
            this.dataSource.data.forEach(node => {
                this.filterNodes(node, searchText);
            });
            this.expandNodes();
            const visibleNodes = this.getVisibleNodes(this.dataSource.data);
            console.log("Nodos visibles tras la búsqueda:", visibleNodes);
            this.NodoSeleccionado.emit(visibleNodes);
        } else {
            this.articuloService.getArticulosByState(this.states).subscribe({
                next: (data: any) => {
                    console.log(data);
                    this.dataSource.data = data;
                    this.dataChange.next(data);
                    this.resetTree();
                    this.NodoSeleccionado.emit(data);
                },
                error: (err) => { console.log("Error al cargar los Artículos") }
            });
            this.treeControl.collapseAll();
        }
    }

    resetVisibility(nodes: Node[]) {
        nodes.forEach(node => {
            node.isVisible = false;
            if (node.children) {
                this.resetVisibility(node.children);
            }
        });
    }

    resetTree() {
        this.treeControl.collapseAll();
        this.resetVisibility(this.dataSource.data);
    }

    filterNodes(node: Node, searchText: string, ancestors: Node[] = []): boolean {
        node.isVisible = node.name.toLowerCase().includes(searchText);

        if (node.children && node.children.length > 0) {
            const childrenVisible = node.children.map(child => this.filterNodes(child, searchText, [...ancestors, node])).some(visible => visible);
            node.isVisible = node.isVisible || childrenVisible;
        }

        if (node.isVisible && ancestors.length) {
            ancestors.forEach(ancestor => ancestor.isExpanded = true);
        }

        return node.isVisible;
    }

    expandNodes() {
        const expandRecursive = (node: Node) => {
            if (node.isExpanded) {
                this.treeControl.expand(node);
                node.isExpanded = false;
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => expandRecursive(child));
            }
        };

        this.dataSource.data.forEach(node => expandRecursive(node));
    }

    agregarPadre() {

        if (this.content && this.form.value.titulo != '' && this.form.value.estado != null) {
            let datosKeycloak: any = this.keycloakauthService.getLoggedUser();
            let usuarioCreacion: any = datosKeycloak.preferred_username;

            const pipeTextFromObject = new TextFromObjectPipe();
            const nuevoHijo: Node = {
                name: this.form.controls['titulo'].value,
                content: this.content,
                state: this.form.controls['estado'].value,
                children: [],
                referencia: this.form.controls['referencia'].value,
                content_transform: pipeTextFromObject.transform(this.content),
                isVisible: false,
                isExpanded: false,
                fecha_creacion: new Date(),
                usuario_creacion: usuarioCreacion
            };
            this.actualizarDatos();
            this.dataChange.next(this.dataSource.data);
            this.articuloService.createArticulo(nuevoHijo).subscribe({
                next: (resp: any) => {
                    this._snackBar.open('El registro se guardó con éxito', 'Cerrar', {
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                    });
                    this.classApplied = !this.classApplied;
                    this.banderaPadre = false;
                    this.obtenerTodosEstados(this.states);
                },
                error: err => {
                    console.log('Error al guardar');
                }
            });
        } else {
            this._snackBar.open('Completar todos los campos obligatorios', 'Cerrar', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }
    }

    agregarHijo(node: Node) {


        if (this.content && this.form.value.titulo != '' && this.form.value.estado != null) {
            let datosKeycloak: any = this.keycloakauthService.getLoggedUser();
            let usuarioCreacion: any = datosKeycloak.preferred_username;
            const pipeTextFromObject = new TextFromObjectPipe();
            const nuevoHijo: Node = {
                name: this.form.controls['titulo'].value,
                content: this.content,
                content_transform: pipeTextFromObject.transform(this.content),
                state: this.form.controls['estado'].value,
                children: [],
                referencia: this.form.controls['referencia'].value,
                isVisible: false,
                isExpanded: false,
                fecha_creacion: new Date(),
                usuario_creacion: usuarioCreacion
            };
            if (!node.children) {
                node.children = [];
            }
            node.children.push(nuevoHijo);
            this.actualizarDatos();
            this.dataChange.next(this.dataSource.data);
            this.classApplied = !this.classApplied;
            if (this.datoSeleccionadoGuardar?.id_padre == null) {
                this.articuloService.createHijos(nuevoHijo, this.datoSeleccionadoGuardar?.id, this.datoSeleccionadoGuardar?.id).subscribe({
                    next: (resp: any) => {
                        this._snackBar.open('El registro se guardó con éxito', 'Cerrar', {
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        });
                        this.obtenerTodosEstados(this.states);
                    },
                    error: err => {
                        console.log('Error al guardar');
                    }
                });
            } else {
                this.articuloService.createHijos(nuevoHijo, this.datoSeleccionadoGuardar?.id_padre, this.datoSeleccionadoGuardar?.id).subscribe({
                    next: (resp: any) => {
                        this.obtenerTodosEstados(this.states);
                    },
                    error: err => {
                        console.log('Error al guardar');
                    }
                });
            }
        } else {
            this._snackBar.open('Completar todos los campos obligatorios', 'Cerrar', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }
    }

    private actualizarDatos() {
        const data = this.dataSource.data;
        this.dataSource.data = [];
        this.dataSource.data = data;
    }

    abrirModalNuevo(node: Node) {
        this.borrarForm();
        this.classApplied = !this.classApplied;
        this.datoSeleccionado = node;
        this.datoSeleccionadoGuardar = JSON.parse(JSON.stringify(node));
    }

    toggleClass() {
        this.borrarForm();
        this.classApplied = !this.classApplied;
    }

    guardarNodo() {
        if (this.banderaPadre) {
            this.agregarPadre();
        } else {
            this.agregarHijo(this.datoSeleccionado);
        }
    }

    handleEditorContentChanged(content: string) {
        this.content = content;
    }

    getVisibleNodes(nodes: Node[]): Node[] {
        const visibleNodes: Node[] = [];

        const traverseNodes = (nodes: Node[]) => {
            nodes.forEach(node => {
                if (node.isVisible) {
                    visibleNodes.push(node);
                }
                if (node.children) {
                    traverseNodes(node.children);
                }
            });
        };

        traverseNodes(nodes);

        return visibleNodes;
    }

    crearArticulo(banderaPadre: boolean) {
        this.banderaPadre = banderaPadre;
        this.toggleClass();
    }

    borrarForm() {
        this.parentMessage = '';
        this.form.patchValue({
            titulo: null,
            contenido: null,
            estado: null,
            referencia: null,
        });
        this.form.reset();

        this.showEditor = false;
        setTimeout(() => this.showEditor = true, 0);
    }

    sanitizeContent(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}

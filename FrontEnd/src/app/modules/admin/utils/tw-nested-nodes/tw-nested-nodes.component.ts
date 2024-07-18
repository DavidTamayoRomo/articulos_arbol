import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output,  inject } from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { Validators } from 'ngx-editor';
import {  MatFormFieldModule } from '@angular/material/form-field';
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
    imports: [CommonModule,MatTreeModule, MatButtonModule, MatIconModule, FormsModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, EditorsComponent, HasRoleDirective, EditorQuillComponent, ],
    templateUrl: './tw-nested-nodes.component.html',
    styleUrl: './tw-nested-nodes.component.scss'
})
export class TwNestedNodesComponent {
    showEditor = true; 
    @Output() NodoSeleccionado = new EventEmitter<Node[]>();

    // Añade un BehaviorSubject para manejar los datos del árbol
    private dataChange = new BehaviorSubject<Node[]>([]);

    treeControl = new NestedTreeControl<Node>(node => node.children);
    dataSource = new MatTreeNestedDataSource<Node>();
    searchText = '';

    classApplied = false;
    datoSeleccionado: any;
    datoSeleccionadoGuardar: any;
    content: any;

    banderaPadre = false;

    form!: FormGroup;
    states:string[]= ['activo'];

    parentMessage: any ='';

    private fb = inject(FormBuilder);
    constructor(
        public themeService: CustomizerSettingsService,
        public articuloService: ArticuloService,
        private _snackBar: MatSnackBar,
        private keycloakauthService: KeycloakAuthService,
        private dataService: DataService,
        private estadosService: EstadosService,
        private sanitizer: DomSanitizer
    ) {

    }
    message: string;
    ngOnInit(): void {
        this.form = this.fb.group({
            titulo: [null, [Validators.required]],
            contenido: [null],
            estado: [null, [Validators.required]],
            referencia: [null],
        });
        //this.obtenerTodos();
        this.obtenerTodosEstados(['activo'])
        this.dataService.currentMessage.subscribe(message => {
            this.message = message;
            console.log(this.message);
            this.searchText = '';
            this.obtenerTodosEstados(this.states);
        });

        this.estadosService.currentMessage.subscribe((message:string[])=>{
            this.obtenerTodosEstados(message);
            this.states = message;
        })

    }

    obtenerTodosEstados(lista:string[]) {
        this.articuloService.getArticulosByState(lista).subscribe({
            next: (data: any) => {
                console.log(data);
                this.dataSource.data = data;
                this.dataChange.next(data); // Inicializa el BehaviorSubject con los datos del árbol
                this.dataChange.subscribe(data => this.dataSource.data = data); // Suscríbete a los cambios y actualiza la fuente de datos
                this.resetTree();
            },
            error: (err) => { console.log("Error al cargar los Artículos") }
        })
    }

    hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;


    logNodeData(node: any) {
        console.log(node);
        this.NodoSeleccionado.emit([node]);
    }

    search() {
        const searchText = this.searchText.toLowerCase();
        this.resetTree(); // Restablece el árbol a su estado original antes de cada búsqueda

        if (searchText) {
            this.dataSource.data.forEach(node => {
                this.filterNodes(node, searchText);
            });
            this.expandNodes(); // Función para expandir solo los nodos necesarios
            const visibleNodes = this.getVisibleNodes(this.dataSource.data);
            console.log("Nodos visibles tras la búsqueda:", visibleNodes); // Imprimir los nodos visibles
            //Enviar al componente los visibles
            this.NodoSeleccionado.emit(visibleNodes);
        } else {
            this.articuloService.getArticulosByState(this.states).subscribe({
                next: (data: any) => {
                    console.log(data);
                    this.dataSource.data = data;
                    this.dataChange.next(data); // Inicializa el BehaviorSubject con los datos del árbol
                    this.dataChange.subscribe(data => this.dataSource.data = data); // Suscríbete a los cambios y actualiza la fuente de datos
                    this.resetTree();
                    this.NodoSeleccionado.emit(data);
                },
                error: (err) => { console.log("Error al cargar los Artículos") }
            })
            this.treeControl.collapseAll(); // Colapsa todo si no hay texto de búsqueda
        }
    }

    // Función para restablecer la visibilidad
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

    // Función recursiva para buscar y marcar nodos
    filterNodes(node: Node, searchText: string, ancestors: Node[] = []): boolean {
        node.isVisible = node.name.toLowerCase().includes(searchText);

        if (node.children) {
            const childrenVisible = node.children.map(child => this.filterNodes(child, searchText, [...ancestors, node])).some(visible => visible);
            node.isVisible = node.isVisible || childrenVisible;
        }

        if (node.isVisible && ancestors.length) {
            // Aquí solo marcas los ancestros para expansión, pero la expansión real la haremos después
            ancestors.forEach(ancestor => ancestor.isExpanded = true);
        }

        return node.isVisible;
    }


    expandNodes() {
        const expandRecursive = (node: Node) => {
            if (node.isExpanded) {
                this.treeControl.expand(node);
                node.isExpanded = false; // Opcional: limpiar la marca si no se necesita después
            }
            if (node.children) {
                node.children.forEach(child => expandRecursive(child));
            }
        };

        this.dataSource.data.forEach(node => expandRecursive(node));
    }


    agregarPadre() {

        let datosKeycloak: any = this.keycloakauthService.getLoggedUser();
        let usuarioCreacion: any = datosKeycloak.preferred_username;

        const pipeTextFromObject = new TextFromObjectPipe();
        console.log(pipeTextFromObject.transform(this.content));
        // Añadir lógica para generar un nuevo nodo
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
        console.log(nuevoHijo);
        // actualizamos la fuente de datos para forzar un cambio de detección.
        this.actualizarDatos();
        // No modifiques directamente this.dataSource.data. En su lugar, emite un nuevo valor a través de dataChange
        this.dataChange.next(this.dataSource.data);



        if (this.content && this.form.valid) {
            //guardar base de datos
            this.articuloService.createArticulo(nuevoHijo).subscribe({
                next: (resp: any) => {
                    this._snackBar.open('El registro se guardo con éxito', 'Cerrar', {
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                    });
                    this.classApplied = !this.classApplied;
                    console.log(resp);
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
        let datosKeycloak: any = this.keycloakauthService.getLoggedUser();
        let usuarioCreacion: any = datosKeycloak.preferred_username;
        const pipeTextFromObject = new TextFromObjectPipe();
        console.log(node);
        console.log(this.datoSeleccionadoGuardar);
        // Añadir lógica para generar un nuevo nodo
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
        // actualizamos la fuente de datos para forzar un cambio de detección.
        this.actualizarDatos();
        // No modifiques directamente this.dataSource.data. En su lugar, emite un nuevo valor a través de dataChange
        this.dataChange.next(this.dataSource.data);


        if (this.content && this.form.valid) {
            //guardar base de datos
            this.classApplied = !this.classApplied;
            //guardar base de datos
            if (this.datoSeleccionadoGuardar?.id_padre == null) {
                this.articuloService.createHijos(nuevoHijo, this.datoSeleccionadoGuardar?.id, this.datoSeleccionadoGuardar?.id).subscribe({
                    next: (resp: any) => {
                        this._snackBar.open('El registro se guardo con éxito', 'Cerrar', {
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        });
                        console.log(resp);
                        this.obtenerTodosEstados(this.states);
                    },
                    error: err => {
                        console.log('Error al guardar');
                    }
                });
            } else {
                this.articuloService.createHijos(nuevoHijo, this.datoSeleccionadoGuardar?.id_padre, this.datoSeleccionadoGuardar?.id).subscribe({
                    next: (resp: any) => {
                        console.log(resp);
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
        // Forzamos una nueva referencia para el array de datos para que Angular detecte el cambio.
        const data = this.dataSource.data;
        this.dataSource.data = [];
        this.dataSource.data = data;
    }


    /* abrirModalNuevo(node: Node) {

    } */



    abrirModalNuevo(node: Node) {
        this.borrarForm();
        this.classApplied = !this.classApplied;
        console.log(this.classApplied);
        console.log(node);
        this.datoSeleccionado = node;
        this.datoSeleccionadoGuardar = JSON.parse(JSON.stringify(node));
        console.log(this.datoSeleccionadoGuardar);
    }

    toggleClass() {
        this.borrarForm();
        this.classApplied = !this.classApplied;
        

        
    }

    guardarNodo() {
        console.log(this.datoSeleccionado);
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
        this.parentMessage ='';
        this.form.patchValue({
            titulo: null,
            contenido: null,
            estado: null,
            referencia: null,
        })
        this.form.reset();

        this.showEditor = false;
        setTimeout(() => this.showEditor = true, 0);
    }

    sanitizeContent(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }


}
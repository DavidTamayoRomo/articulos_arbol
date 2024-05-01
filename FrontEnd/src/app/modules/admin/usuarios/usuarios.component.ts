import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Validators } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { UsuariosService } from '../services/usuarios.service';
import { MatSelectModule } from '@angular/material/select';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakBackService } from '../services/keycloak-back.service';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

const clienteId = environment.keycloakConfig.clientId;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatCardModule, MatStepperModule, FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginator,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  @ViewChild('stepper') stepper: MatStepper;

  firstFormGroup = this._formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
  });
  
  segundoFormGroup = this._formBuilder.group({
  });

  dataSource: any = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombre', 'apellido','usuario','accion'];

  clickedRows = new Set<any>();

  usuarioSeleccionado:any;
  rolesUsuario:any;

  // Select Emails
  roles = new FormControl('');
  rolList: any[] = [];
  visualizarRol:boolean=false;

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private usuariosService:UsuariosService,
    private keycloakBackService:KeycloakBackService,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    
    
    this.dataSource.data = [];
    this.usuariosService.getRoles().subscribe({
      next:(resp:any)=>{
        this.rolList = resp;

      },
      error:(err:any)=>{

      }
    })
  }

  ngAfterViewInit() {
    //Paginar
    this.dataSource.paginator;
  }


  buscarUsuario(){
    console.log(this.firstFormGroup.value);
    if (this.firstFormGroup.value?.apellido) {
      this.usuariosService.getUsuarioApellido(this.firstFormGroup.value?.apellido.toString()).subscribe({
        next:((resp:any)=>{
          console.log(resp);
          this.dataSource.data= resp;

        }),
        error:((err:any)=>{
          console.warn(err);
        })
      })
    }else if (this.firstFormGroup.value?.nombre) {

    }else{
      console.log("Ingrese valor Apellido o nombre");
    }
  }


  clickedRowFn(row: any) {
    console.log(row);
    if (this.clickedRows.has(row)) {
      this.resetDatos();
      this.clickedRows.delete(row);
    } else {
      this.clickedRows.clear();
      this.resetDatos();
      this.clickedRows.add(row);
      //this.datos(row);
    }
  }

  resetDatos() {
    //this.usuariosSelecionado = null;
    //this.secondFormGroup.reset();
  }

  secondStep(element:any){
    console.log(element);
    this.stepper.selectedIndex = 1;
    this.usuarioSeleccionado=element;
    this.keycloakBackService.getClient(clienteId).subscribe({
      next:(resp:any)=>{
        this.keycloakBackService.getRolUserClient(resp.id, element.id).subscribe({
          next:(resp:any)=>{
            this.rolesUsuario=resp;
            
            if (resp.length>0) {
              this.visualizarRol = false
            }else{
              this.visualizarRol = true
            }
          },
          error:(err:any)=>{

          }
        })
      },
      error:(err:any)=>{

      }
    })
  }

  guardarRol(){
    console.log(this.roles.value);
    this.usuariosService.guardarRol([this.roles.value], this.usuarioSeleccionado.id).subscribe({
      next:(resp:any)=>{
        console.log(resp);
        this._snackBar.open('Rol asignado correctamente', 'Cerrar', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.visualizarRol = !this.visualizarRol;
      },
      error:(err:any)=>{

      }
    })
  }

  eliminarRol(){
    this.keycloakBackService.quitarRol(this.usuarioSeleccionado.id,this.rolesUsuario ).subscribe({
      next:(resp:any)=>{
        this._snackBar.open('Rol eliminado correctamente', 'Cerrar', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        console.log(resp);
        this.visualizarRol = !this.visualizarRol;
      },
      error:(err:any)=>{

      }
    })
    
  }




}

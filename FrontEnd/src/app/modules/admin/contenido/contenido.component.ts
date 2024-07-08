import { Component } from '@angular/core';
import { AdvanceComponent } from '../utils/advance/advance.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HistorialService } from '../services/historial.service';

@Component({
  selector: 'app-contenido',
  standalone: true,
  imports: [AdvanceComponent],
  templateUrl: './contenido.component.html',
  styleUrl: './contenido.component.scss'
})
export class ContenidoComponent {
  data: any;
  listaCambios: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private historialService:HistorialService
  ) {}

  ngOnInit() {
    this.activatedroute.params.subscribe((data) => {
      console.log(data);

      //consultar  el contenido por su id
      this.historialService.getHistorialById(data['id']).subscribe({
        next:(resp:any)=>{
          console.log(resp);
          //Enviar al componente la lista
          this.listaCambios = resp;
        },
        error:(e)=>{
          alert("Error al cargar la información");
        }
      });
      
    });

  }
}

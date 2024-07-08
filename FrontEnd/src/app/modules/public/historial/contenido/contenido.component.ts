import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HistorialService } from '../../../admin/services/historial.service';
import { AdvanceComponent } from '../../../admin/utils/advance/advance.component';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { ToggleService } from '../../../../common/sidebar/toggle.service';
import { CustomizerSettingsComponent } from '../../../../common/customizer-settings/customizer-settings.component';
import { FooterComponent } from '../../../../common/footer/footer.component';
import { HeaderComponent } from '../../../../common/header/header.component';
import { SidebarComponent } from '../../../../common/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contenido',
  standalone: true,
  imports: [AdvanceComponent, RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent, RouterLink, CustomizerSettingsComponent, CommonModule, MatCardModule],
  templateUrl: './contenido.component.html',
  styleUrl: './contenido.component.scss'
})
export class ContenidoComponentPublico {
  // isSidebarToggled
  isSidebarToggled = false;

  data: any;
  listaCambios: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private historialService:HistorialService,
    public themeService: CustomizerSettingsService,
    private toggleService: ToggleService
  ) {
    this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
      this.isSidebarToggled = isSidebarToggled;
  });
  }

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

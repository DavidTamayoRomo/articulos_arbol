import { Component } from '@angular/core';
import { ListaArticulosComponent } from '../../admin/lista-articulos/lista-articulos.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CustomizerSettingsComponent } from '../../../common/customizer-settings/customizer-settings.component';
import { FooterComponent } from '../../../common/footer/footer.component';
import { HeaderComponent } from '../../../common/header/header.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { ToggleService } from '../../../common/sidebar/toggle.service';

@Component({
  selector: 'app-contenido',
  standalone: true,
  imports: [ListaArticulosComponent, CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent, RouterLink, CustomizerSettingsComponent],
  templateUrl: './contenido.component.html',
  styleUrl: './contenido.component.scss'
})
export class ContenidoComponent {

  // isSidebarToggled
  isSidebarToggled = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private toggleService: ToggleService
  ){
    this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
      this.isSidebarToggled = isSidebarToggled;
  });
  }
}

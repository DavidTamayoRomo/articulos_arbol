import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../../../directives/has-role.directive';
import { HighlightPipe } from '../../../../highlight.pipe';

@Component({
    selector: 'app-advance',
    standalone: true,
    imports: [RouterModule, MatCardModule, MatButtonModule, MatMenuModule, CommonModule, HasRoleDirective,HighlightPipe],
    templateUrl: './advance.component.html',
    styleUrl: './advance.component.scss'
})
export class AdvanceComponent {

    @Input() listaCambios:any;

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private router:Router
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    regresar(){
        window.history.back();
        this.router.navigate(['/admin/lista-articulos'] );
    }

}
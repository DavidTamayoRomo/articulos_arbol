import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-advance',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, CommonModule],
    templateUrl: './advance.component.html',
    styleUrl: './advance.component.scss'
})
export class AdvanceComponent {

    @Input() listaCambios:any;

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

}
import {
  NgModule
} from '@angular/core';
import {
  MatSidenavModule,
  MatTabsModule,
  MatInputModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatSnackBarModule,
  MatButtonModule,
  MatDatepickerModule,
  MatRadioModule,
  MatOptionModule,
  MatSelectModule
} from '@angular/material';

@NgModule({
  imports: [MatCheckboxModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatCardModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatInputModule, MatTabsModule],
  exports: [MatCheckboxModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatCardModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatInputModule, MatTabsModule]
})
export class MaterialModule {}

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
  MatNativeDateModule,
  MatRadioModule,
  MatOptionModule,
  MatSelectModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [MatCheckboxModule, MatProgressSpinnerModule, MatNativeDateModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatCardModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatInputModule, MatTabsModule],
  exports: [MatCheckboxModule, MatProgressSpinnerModule, MatNativeDateModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatCardModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatInputModule, MatTabsModule]
})
export class MaterialModule {}

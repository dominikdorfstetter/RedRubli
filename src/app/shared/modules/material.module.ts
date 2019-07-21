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
  MatButtonModule
} from '@angular/material';

@NgModule({
  imports: [MatCheckboxModule,  MatCardModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatInputModule, MatTabsModule],
  exports: [MatCheckboxModule, MatCardModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatInputModule, MatTabsModule]
})
export class MaterialModule {}

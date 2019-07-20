import {
  NgModule
} from '@angular/core';
import {
  MatSidenavModule,
  MatTabsModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule
} from '@angular/material';

@NgModule({
  imports: [MatCheckboxModule, MatCardModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatTabsModule],
  exports: [MatCheckboxModule, MatCardModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatTabsModule]
})
export class MaterialModule {}

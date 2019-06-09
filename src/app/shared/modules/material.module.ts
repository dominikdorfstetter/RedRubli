import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [MatCheckboxModule, MatCardModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule],
  exports: [MatCheckboxModule, MatCardModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule]
})
export class MaterialModule { }

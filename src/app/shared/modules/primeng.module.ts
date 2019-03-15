import { NgModule } from '@angular/core';

/* Modules */
import { AccordionModule } from 'primeng/accordion';     // accordion and accordion tab
import { CardModule } from 'primeng/card';              // Card Module

/* Interfaces */
import { MenuItem } from 'primeng/api';                 // api

@NgModule({
  declarations: [],
  imports: [ AccordionModule, CardModule ],
  exports: [ AccordionModule, CardModule ],
  providers: [],
})
export class PrimeNgModule { }

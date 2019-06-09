/* jQuery variable definieren */
declare var $: any;

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

/* environment */
import { environment } from '../environments/environment';

/* component Libraries */
import { MaterialModule } from './shared/modules/material.module';

import { AppRoutingModule } from './app-routing.module';

/* The actual app components */
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DemoComponent } from './components/demo/demo.component';
import { StartComponent } from './components/start/start.component';

/* Multi Touch Support */
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    MenuComponent,
    FooterComponent,
    ImpressumComponent,
    PageNotFoundComponent,
    DemoComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

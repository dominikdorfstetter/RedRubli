/* jQuery variable definieren */
declare var $: any;

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

/* environment */
import { environment } from '../environments/environment';

/* component Libraries */
import { MaterialModule } from './shared/modules/material.module';

/* The actual app components */
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DemoComponent } from './components/demo/demo.component';
import { StartComponent } from './components/start/start.component';

/* Google Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

/* Multi Touch Support */
import 'hammerjs';

import { RoutingModule } from './shared/modules/routing.module';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountriesPipe } from './shared/pipes/countries.pipe';
import { FirestoreDatePipe } from './shared/pipes/firestore.date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    MenuComponent,
    FooterComponent,
    ImpressumComponent,
    PageNotFoundComponent,
    DemoComponent,
    StartComponent,
    LoginComponent,
    RegisterComponent,
    CountriesPipe,
    FirestoreDatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

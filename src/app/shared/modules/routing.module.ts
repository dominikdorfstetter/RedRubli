import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';
import { StartComponent } from '../../components/start/start.component';
import { DemoComponent } from '../../components/demo/demo.component';
import { AboutComponent } from '../../components/about/about.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from '@angular/fire/auth';


const routes: Routes = [
  { path: 'home', component: StartComponent, pathMatch: 'full'},
  { path: 'demo', component: DemoComponent, pathMatch: 'full', ...canActivate(redirectUnauthorizedTo(['home']))},
  { path: 'about', component: AboutComponent, pathMatch: 'full'},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [
    AngularFireAuthModule,
    CommonModule,
    RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../../../components/page-not-found/page-not-found.component';
import { StartComponent } from '../../../components/start/start.component';
import { ImpressumComponent } from '../../../components/impressum/impressum.component';
import { DemoComponent } from '../../../components/demo/demo.component';
import { AboutComponent } from '../../../components/about/about.component';


const routes: Routes = [
  { path: 'home', component: StartComponent},
  { path: 'impressum', component: ImpressumComponent},
  { path: 'demo', component: DemoComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }

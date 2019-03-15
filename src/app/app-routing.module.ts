import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DemoComponent } from './components/demo/demo.component';
import { StartComponent } from './components/start/start.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: 'demo/:name', component: DemoComponent },
  {
    path: 'demo',
    component: DemoComponent
  }, {
    path: 'start',
    component: StartComponent
  }, {
    path: 'impressum',
    component: ImpressumComponent
  }, {
    path: 'about',
    component: AboutComponent
  }, {
    path: 'impressum',
    component: ImpressumComponent
  },
  { path: '',
    redirectTo: '/start',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes/* , { enableTracing: true } */)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

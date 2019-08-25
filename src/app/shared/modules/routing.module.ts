import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';
import { StartComponent } from '../../components/start/start.component';
import { DemoComponent } from '../../components/demo/demo.component';
import { AboutComponent } from '../../components/about/about.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { RegisterComponent } from 'src/app/shared/components/register/register.component';
import { AdminGuard } from '../guards/admin.guard';


const routes: Routes = [
  { path: 'home', component: StartComponent, pathMatch: 'full'},
  { path: 'demo', component: DemoComponent, pathMatch: 'full', canActivate: [AdminGuard]},
  { path: 'about', component: AboutComponent, pathMatch: 'full'},
  { path: 'register', component: RegisterComponent, pathMatch: 'full'},
  { path: 'profile', component: ProfileComponent, pathMatch: 'full'},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
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

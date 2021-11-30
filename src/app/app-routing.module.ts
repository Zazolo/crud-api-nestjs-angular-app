import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { ActionsPageComponent } from './actions-page/actions-page.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: '', redirectTo:'inicio', pathMatch: 'full'},
  { path: 'inicio', component: HomePageComponent },
  { path: 'logs', component: ActionsPageComponent },
  { path: 'sobre', component: AboutPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

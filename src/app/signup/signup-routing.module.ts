import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }

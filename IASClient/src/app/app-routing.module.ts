import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component';
import { AuthGuardService } from './_services/auth-guard.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:id', component: DetailComponent, canActivate: [AuthGuardService] },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuardService]},
  { path: '*', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

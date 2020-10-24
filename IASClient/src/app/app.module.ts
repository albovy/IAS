import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DetailComponent } from './detail/detail.component';
import { UploadComponent } from './upload/upload.component'
import { HomeComponent } from './home/home.component'

import { AuthInterceptor } from './_interceptors/auth.interceptor';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DetailComponent,
    UploadComponent,
    HomeComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    NgxSkeletonLoaderModule,
    NgxDropzoneModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

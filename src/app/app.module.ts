import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CulturalAssetsComponent } from './cultural-assets/cultural-assets.component';
import { CulturalAssetDetailComponent } from './cultural-asset-detail/cultural-asset-detail.component';
import { StoryDetailComponent } from './story-detail/story-detail.component';
import { LoginComponent } from './login/login.component';
import { MyStoriesComponent } from './my-stories/my-stories.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    CulturalAssetsComponent,
    CulturalAssetDetailComponent,
    StoryDetailComponent,
    LoginComponent,
    MyStoriesComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

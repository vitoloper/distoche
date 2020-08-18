import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

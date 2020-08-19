import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CulturalAssetsComponent } from './cultural-assets/cultural-assets.component';
import { CulturalAssetDetailComponent } from './cultural-asset-detail/cultural-asset-detail.component';
import { StoryDetailComponent } from './story-detail/story-detail.component';
import { LoginComponent } from './login/login.component';
import { MyStoriesComponent } from './my-stories/my-stories.component';
import { EditStoryComponent } from './edit-story/edit-story.component';

import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'beni', component: CulturalAssetsComponent },
  { path: 'beni/:id', component: CulturalAssetDetailComponent },
  { path: 'storie/:id', component: StoryDetailComponent },
  {
    path: 'utente/storie', component: MyStoriesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.esperto, Role.fruitore] }
  },
  {
    path: 'utente/storie/:id', component: EditStoryComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.esperto, Role.fruitore] }
  },
  { path: '**', redirectTo: 'beni' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

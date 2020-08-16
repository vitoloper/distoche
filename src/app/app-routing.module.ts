import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CulturalAssetsComponent } from './cultural-assets/cultural-assets.component';
import { CulturalAssetDetailComponent } from './cultural-asset-detail/cultural-asset-detail.component';
import { StoryDetailComponent } from './story-detail/story-detail.component';
import { LoginComponent } from './login/login.component';
import { MyStoriesComponent } from './my-stories/my-stories.component';

import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'beni', component: CulturalAssetsComponent },
  { path: 'beni/:id', component: CulturalAssetDetailComponent },
  { path: 'storie/:id', component: StoryDetailComponent },
  {
    path: 'utente/storie', component: MyStoriesComponent,
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

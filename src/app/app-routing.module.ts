import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CulturalAssetsComponent } from './cultural-assets/cultural-assets.component';
import { CulturalAssetDetailComponent } from './cultural-asset-detail/cultural-asset-detail.component';

const routes: Routes = [
  {path: 'beni', component: CulturalAssetsComponent },
  {path: 'beni/:id', component: CulturalAssetDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

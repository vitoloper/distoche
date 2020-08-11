import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CulturalAssetsComponent } from './cultural-assets/cultural-assets.component';

const routes: Routes = [
  {path: 'beni', component: CulturalAssetsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

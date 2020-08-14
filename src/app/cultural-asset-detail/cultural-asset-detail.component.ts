import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CulturalAssetService } from '../cultural-asset.service';

@Component({
  selector: 'app-cultural-asset-detail',
  templateUrl: './cultural-asset-detail.component.html',
  styleUrls: ['./cultural-asset-detail.component.css']
})
export class CulturalAssetDetailComponent implements OnInit {
  assetId;
  asset;

  constructor(private route: ActivatedRoute, private assetService: CulturalAssetService) { }

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id');
    this.getAssetDetail();
  }

  getAssetDetail(): void {
    this.assetService.getAssetDetail(this.assetId)
      .subscribe(
        (result) => {
          this.asset = result[0];
        }, (err) => {
          console.log(err);
        }
      );
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CulturalAssetService } from '../cultural-asset.service';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.css']
})
export class EditAssetComponent implements OnInit {
  assetId;
  asset;
  isErrorAlertHidden = true;
  isSavedOkAlertHidden = true;
  isSaveErrorAlertHidden = true;

  constructor(private router: Router, private route: ActivatedRoute,
    private assetService: CulturalAssetService, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id');

    // if id is 'new' we are in creation mode, otherwise we are in editing mode
    if (this.assetId === 'new') {
      this.asset = {
        titolo: '',
        descr: ''
      };
    } else {
      this.getAssetDetail();
    }
  }

  /**
   * Get asset detail
   * 
   */
  private getAssetDetail(): void {
    this.isErrorAlertHidden = true;

    this.assetService.getAssetDetail(this.assetId)
      .subscribe(
        (result) => {
          this.asset = result[0];
        }, (err) => {
          this.isErrorAlertHidden = false;
          console.log(err);
        }
      );
  }

  /**
   * Choose file and upload it
   * @param event 
   * 
   */
  onFileChanged(event) {
    const file = event.target.files[0];
    const uploadData = new FormData();
    console.log(file);
    uploadData.append('photo', file, file.name);

    this.uploadService.uploadImage(uploadData).subscribe(result => {
      console.log(result);
      this.asset.cover_img_url = 'api/images/' + result.filename;
    },
      err => {
        console.log(err);
      });
  }

}

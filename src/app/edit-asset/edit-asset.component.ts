import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CulturalAssetService } from '../cultural-asset.service';
import { UploadService } from '../upload.service';

// import * as L from 'leaflet';
import 'leaflet';
import 'leaflet-draw';
import "leaflet/dist/images/marker-shadow.png";
declare const L: any;

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
  private map;
  private previousLayer;
  private currentLayer;
  drawnItems = new L.FeatureGroup();

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

  ngAfterViewInit(): void {
    this.initMap();

    // Retrieve assets on map change
    this.map.on('moveend', () => {

    });

  }

  /**
   * Initialize map
   * 
   */
  private initMap(): void {
    this.map = L.map('map', {
      center: [41.50, 12.51],
      zoom: 5
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // FeatureGroup is to store editable layers
    var drawnItems = this.drawnItems;
    this.map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        rectangle: false,
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: true
      },
      edit: {
        featureGroup: drawnItems,
        edit: false
      }
    });
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event) => {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      // Remove previous layer (marker)
      if (this.currentLayer) {
        drawnItems.removeLayer(this.currentLayer);
      }

      // This is the new current layer (marker)
      this.currentLayer = layer;
      this.asset.lat = Number(layer.getLatLng().lat.toFixed(3));
      this.asset.lon = Number(layer.getLatLng().lng.toFixed(3));
    });

    this.map.on(L.Draw.Event.DELETED, (event) => {
      this.currentLayer = null;
      this.asset.lat = null;
      this.asset.lon = null;
    });

  } // initMap


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

          // Update location map (add maker to drawnItems map layer)
          var marker = L.marker([this.asset.lat, this.asset.lon]);
          this.currentLayer = marker;
          this.drawnItems.addLayer(marker);
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

  /**
   * Save asset
   * 
   */
  saveAsset(): void {

    // New cultural asset or editing mode
    if (this.assetId === 'new') {
      this.assetService.createAsset(this.asset)
        .subscribe(
          result => {
            this.isSavedOkAlertHidden = false;
            this.isSaveErrorAlertHidden = true;
            // Go to 'edit' mode
            this.router.navigate(['/utente/beni', result.id]);
            this.assetId = result.id;
            this.getAssetDetail();
          },
          err => {
            this.isSavedOkAlertHidden = true;
            this.isSaveErrorAlertHidden = false;
            console.log(err);
          }
        );
    } else {
      this.assetService.updateAsset(this.asset.id, this.asset)
        .subscribe(
          result => {
            this.isSavedOkAlertHidden = false;
            this.isSaveErrorAlertHidden = true;
            this.asset = result;
          },
          err => {
            this.isSavedOkAlertHidden = true;
            this.isSaveErrorAlertHidden = false;
            console.log(err);
          }
        );
    }
  }

}

import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { CulturalAssetService } from '../cultural-asset.service';
import * as L from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";

@Component({
  selector: 'app-cultural-assets',
  templateUrl: './cultural-assets.component.html',
  styleUrls: ['./cultural-assets.component.css']
})
export class CulturalAssetsComponent implements OnInit, AfterViewInit {
  assets: any[];
  private map;
  isErrorAlertHidden;

  // Pagination
  totalPages: number;
  elementsPerPage: number;  // LIMIT
  currentPage: number;
  offset: number;
  isPrevPageHidden: boolean;
  isNextPageHidden: boolean;
  totalElements: number;

  // Order
  ordering = { field: 'created_at', direction: 'desc' };

  // Name search
  nameSearch = '';

  // Map boundaries and markers
  boundaries: any;
  markers = [];

  // Display rows
  rows = [];

  constructor(private assetService: CulturalAssetService) { }

  ngOnInit(): void {
    this.totalPages = 0;
    this.elementsPerPage = 6;  // LIMIT
    this.currentPage = 1;
    this.offset = 0;
    this.isPrevPageHidden = true;
    this.isNextPageHidden = true;
    this.isErrorAlertHidden = true;
  }

  ngAfterViewInit(): void {
    this.initMap();

    // Initialize boundaries
    this.boundaries = this.map.getBounds();

    // Get assets
    this.getAssets();

    // Retrieve assets on map change
    this.map.on('moveend', () => {
      this.boundaries = this.map.getBounds();

      // Reset pagination
      this.currentPage = 1;
      this.offset = 0;

      this.getAssets();
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
  }

  getAssets(): void {
    this.isErrorAlertHidden = true;   // Hide error alert

    this.assetService.getAssets(this.nameSearch, this.boundaries, this.ordering, this.elementsPerPage, this.offset)
      .subscribe(
        (result: any) => {
          // Get cultural assets
          this.assets = result.data;

          // Remove old markers from map
          for (let i = 0; i < this.markers.length; i++) {
            this.map.removeLayer(this.markers[i]);
          }

          this.markers = [];

          // Add markers to map
          for (let i = 0; i < this.assets.length; i++) {
            let marker = new L.marker([this.assets[i].lat, this.assets[i].lon]);
            this.markers.push(marker);
            marker.addTo(this.map).bindPopup(this.assets[i].nome);
          }

          // Arrange data in multiple rows to display it in a grid
          let rows = [];
          let currentRow = -1;
          let currentCol = -1;
          for (let i = 0; i < this.assets.length; i++) {
            // Add a new row, each row contains 3 elements
            if (i % 3 == 0) {
              rows.push([]);
              currentRow++;
              currentCol = 0;
            }

            rows[currentRow][currentCol] = this.assets[i];
            currentCol++;
          }

          this.rows = rows;

          // Show number of total elements on page
          this.totalElements = result.total;

          // Update pagination values
          this.totalPages = Math.ceil(result.total / this.elementsPerPage);

          // Hide next page button
          if (this.currentPage >= this.totalPages) {
            this.isNextPageHidden = true;
          } else {
            this.isNextPageHidden = false;
          }

          // Hide previous page button
          if (this.currentPage <= 1) {
            this.isPrevPageHidden = true;
          } else {
            this.isPrevPageHidden = false;
          }
        },
        (err) => {
          this.isErrorAlertHidden = false;  // Show error alert
          console.log(err);
        }
      );
  } // getAssets

  // Called when searching in asset title
  searchInName(): void {
    // Reset pagination
    this.currentPage = 1;
    this.offset = 0;

    // get assets
    this.getAssets();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.offset = this.offset + this.elementsPerPage;
    this.currentPage++;
    this.getAssets();
  }

  prevPage(): void {
    if (this.currentPage <= 1) return;
    this.offset = this.offset - this.elementsPerPage;
    this.currentPage--;
    this.getAssets();
  }

}

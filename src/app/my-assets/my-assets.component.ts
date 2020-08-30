import { Component, OnInit } from '@angular/core';
import { CulturalAssetService } from '../cultural-asset.service';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.css']
})
export class MyAssetsComponent implements OnInit {
  assets: any[];
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

    // Get mystories
    this.getMyAssets();
  }

  getMyAssets(): void {
    this.isErrorAlertHidden = true;   // Hide error alert

    this.assetService.getMyAssets(this.nameSearch, this.ordering, this.elementsPerPage, this.offset)
      .subscribe(
        (result) => {
          this.assets = result.data;

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
          this.isErrorAlertHidden = false;
          console.log(err);
        }
      );
  } // getMyAssets

  /**
   * Search in cultural asset name
   * 
   */
  searchInName(): void {
    // Reset pagination
    this.currentPage = 1;
    this.offset = 0;

    // get cultural assets
    this.getMyAssets();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.offset = this.offset + this.elementsPerPage;
    this.currentPage++;
    this.getMyAssets();
  }

  prevPage(): void {
    if (this.currentPage <= 1) return;
    this.offset = this.offset - this.elementsPerPage;
    this.currentPage--;
    this.getMyAssets();
  }

  deleteAsset(id): void {
    if (confirm('Cancellare il bene culturale?') !== true) return;

    this.assetService.deleteAsset(id).subscribe(
      result => {
        this.getMyAssets();
      },
      err => {
        console.log(err);
      }
    );
  }

}

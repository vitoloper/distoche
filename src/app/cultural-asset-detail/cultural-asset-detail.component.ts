import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CulturalAssetService } from '../cultural-asset.service';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-cultural-asset-detail',
  templateUrl: './cultural-asset-detail.component.html',
  styleUrls: ['./cultural-asset-detail.component.css']
})
export class CulturalAssetDetailComponent implements OnInit {
  assetId;
  asset;
  stories: any[];
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
  titleSearch = '';

  // Display rows
  rows = [];

  constructor(private route: ActivatedRoute, private assetService: CulturalAssetService, private storyService: StoryService) { }

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id');

    this.totalPages = 0;
    this.elementsPerPage = 6;  // LIMIT
    this.currentPage = 1;
    this.offset = 0;
    this.isPrevPageHidden = true;
    this.isNextPageHidden = true;
    this.isErrorAlertHidden = true;

    // Get cultural asset detail
    this.getAssetDetail();

    // Get stories
    this.getAssetStories();
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

  getAssetStories(): void {
    this.isErrorAlertHidden = true;   // Hide error alert

    this.storyService.getAssetStories(this.assetId, this.titleSearch, this.ordering, this.elementsPerPage, this.offset)
      .subscribe((result) => {
        this.stories = result.data;

        // Arrange data in multiple rows to display it in a grid
        let rows = [];
        let currentRow = -1;
        let currentCol = -1;
        for (let i = 0; i < this.stories.length; i++) {
          // Add a new row, each row contains 3 elements
          if (i % 3 == 0) {
            rows.push([]);
            currentRow++;
            currentCol = 0;
          }

          rows[currentRow][currentCol] = this.stories[i];
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
      }, (err) => {
        this.isErrorAlertHidden = false;
        console.log(err);
      });
  } // getAssetStories

  // Called when searching in story title
  searchInTitle(): void {
    // Reset pagination
    this.currentPage = 1;
    this.offset = 0;

    // get assets
    this.getAssetStories();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.offset = this.offset + this.elementsPerPage;
    this.currentPage++;
    this.getAssetStories();
  }

  prevPage(): void {
    if (this.currentPage <= 1) return;
    this.offset = this.offset - this.elementsPerPage;
    this.currentPage--;
    this.getAssetStories();
  }

}

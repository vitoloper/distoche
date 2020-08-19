import { Component, OnInit } from '@angular/core';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-my-stories',
  templateUrl: './my-stories.component.html',
  styleUrls: ['./my-stories.component.css']
})
export class MyStoriesComponent implements OnInit {
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

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.totalPages = 0;
    this.elementsPerPage = 6;  // LIMIT
    this.currentPage = 1;
    this.offset = 0;
    this.isPrevPageHidden = true;
    this.isNextPageHidden = true;
    this.isErrorAlertHidden = true;

    // Get mystories
    this.getMyStories();
  }

  getMyStories(): void {
    this.isErrorAlertHidden = true;   // Hide error alert

    this.storyService.getMyStories(this.titleSearch, this.ordering, this.elementsPerPage, this.offset)
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
  }

  // Called when searching in story title
  searchInTitle(): void {
    // Reset pagination
    this.currentPage = 1;
    this.offset = 0;

    // get stories
    this.getMyStories();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.offset = this.offset + this.elementsPerPage;
    this.currentPage++;
    this.getMyStories();
  }

  prevPage(): void {
    if (this.currentPage <= 1) return;
    this.offset = this.offset - this.elementsPerPage;
    this.currentPage--;
    this.getMyStories();
  }

}

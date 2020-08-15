import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StoryService } from '../story.service';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.css']
})
export class StoryDetailComponent implements OnInit {
  storyId;
  story;
  contenuto;
  isErrorAlertHidden = true;

  constructor(private route: ActivatedRoute, private storyService: StoryService) { }

  ngOnInit(): void {
    this.storyId = this.route.snapshot.paramMap.get('id');

    // Get story detail
    this.getStoryDetail();
  }

  private getStoryDetail(): void {
    this.isErrorAlertHidden = true;

    this.storyService.getStoryDetail(this.storyId)
      .subscribe(
        (result) => {
          this.story = result[0];
        }, (err) => {
          this.isErrorAlertHidden = false;
          console.log(err);
        }
      );
  }

}

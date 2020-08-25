import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StoryService } from '../story.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from '../authentication.service';
import { User } from '../_models/user';
import { Role } from '../_models/role';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.css']
})
export class StoryDetailComponent implements OnInit {
  Editor = ClassicEditor;
  storyId;
  story;
  contenuto;
  isErrorAlertHidden = true;

  // User
  user: User;

  // CKEditor configuration
  ckConfig = {
    toolbar: []
  };

  constructor(private authService: AuthenticationService,
    private route: ActivatedRoute,
    private storyService: StoryService) {
    this.authService.user.subscribe(x => this.user = x);
  }

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

  approveStory(): void {
    this.storyService.approveStory(this.story.id).subscribe(
      result => {
        // Reload story details
        this.getStoryDetail();
      },
      err => {
        // TODO: error alert
        console.log(err);
      }
    );
  }

}

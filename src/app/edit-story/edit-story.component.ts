import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StoryService } from '../story.service';
import { UploadService } from '../upload.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.css']
})
export class EditStoryComponent implements OnInit {
  Editor = ClassicEditor;
  storyId;
  story;
  contenuto = '';
  isErrorAlertHidden = true;
  isSavedOkAlertHidden = true;
  isSaveErrorAlertHidden = true;

  constructor(private route: ActivatedRoute,
    private storyService: StoryService,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.storyId = this.route.snapshot.paramMap.get('id');

    // Get story detail
    this.getStoryDetail();
  }

  /**
   * Get story detail
   * 
   */
  private getStoryDetail(): void {
    this.isErrorAlertHidden = true;

    this.storyService.getStoryDetail(this.storyId)
      .subscribe(
        (result) => {
          this.story = result[0];
          this.contenuto = this.story.contenuto;
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
      this.story.cover_img_url = 'api/images/'+result.filename;
    },
    err => {
      console.log(err);
    });
  }

  /**
   * Save story
   * 
   */
  saveStory(): void {
    // TODO: check if this is a NEW story or we are going to UPDATE an existing one

    // Assign editor content to story content
    this.story.contenuto = this.contenuto;

    this.storyService.updateStory(this.story.id, this.story).subscribe(result => {
      this.isSavedOkAlertHidden = false;
      this.story = result;
    },
    err => {
      console.log(err);
    });
  }

}

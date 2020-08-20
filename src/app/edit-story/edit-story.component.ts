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
  contenuto;
  isErrorAlertHidden = true;

  public model = {
    editorData: '<h1>Hey!</h1>'
  };

  constructor(private route: ActivatedRoute,
    private storyService: StoryService,
    private uploadService: UploadService) { }

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

  /**
   * Choose file and upload it
   * @param event 
   * 
   */
  onFileChanged(event) {
    const file = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('imageFile', file.selectedFile, file.selectedFile.name);

    this.uploadService.uploadImage(uploadData).subscribe(result => {
      console.log(result);
    },
    err => {
      console.log(err);
    });
  }

}

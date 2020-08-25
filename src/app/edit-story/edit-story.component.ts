import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
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
  idBene;
  contenuto = '';
  isErrorAlertHidden = true;
  isSavedOkAlertHidden = true;
  isSaveErrorAlertHidden = true;

  // CKEditor configuration
  ckConfig = {
    // include any other configuration you want
    extraPlugins: [MyUploadPlugin]
  };

  constructor(private router: Router, private route: ActivatedRoute,
    private storyService: StoryService,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.storyId = this.route.snapshot.paramMap.get('id');

    // if id is 'new' we are in creation mode, otherwise we are in editing mode
    if (this.storyId === 'new') {
      this.story = {
        titolo: '',
        descr: ''
      };

      // Get id_bene (associate story with a specific cultural asset)
      this.idBene = this.route.snapshot.queryParamMap.get("idbene");
      this.story.id_bene = this.idBene;
    } else {
      this.getStoryDetail();
    }
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
      this.story.cover_img_url = 'api/images/' + result.filename;
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
    // Assign editor content to story content
    this.story.contenuto = this.contenuto;

    // New story or editing mode
    if (this.storyId === 'new') {
      this.storyService.createStory(this.story)
        .subscribe(
          result => {
            this.isSavedOkAlertHidden = false;
            this.isSaveErrorAlertHidden = true;
            // Go to 'edit' mode
            this.router.navigate(['/utente/storie', result.id]);
            this.storyId = result.id;
            this.getStoryDetail();
          },
          err => {
            this.isSavedOkAlertHidden = true;
            this.isSaveErrorAlertHidden = false;
            console.log(err);
          }
        );
    } else {
      this.storyService.updateStory(this.story.id, this.story)
        .subscribe(
          result => {
            this.isSavedOkAlertHidden = false;
            this.isSaveErrorAlertHidden = true;
            this.story = result;
          },
          err => {
            this.isSavedOkAlertHidden = true;
            this.isSaveErrorAlertHidden = false;
            console.log(err);
          }
        );
    }
  }

} // END EditStoryComponent

// ******************************************************************

class MyUploadPlugin {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  init() {
    this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }
}


/**
 * MyUploadAdapter class
 * 
 */
class MyUploadAdapter {
  loader;
  xhr;

  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();

    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open('POST', '/api/images', true);
    xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Impossibile effettuare l'upload del file ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve({
        default: '/api/images/' + response.filename
      });
    });

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData();

    data.append('photo', file);

    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.

    // Send the request.
    this.xhr.send(data);
  }
}

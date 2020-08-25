import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  assetsUrl = '/api/assets';
  storiesUrl = '/api/stories';
  userStoriesUrl = '/api/user/stories';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  /**
   * Handle errors
   * @param error 
   * 
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(error);
    }
    // return an observable with a user-facing error message
    var userMessage;

    if (error.error.message) {
      userMessage = error.error.message;
    } else {
      userMessage = 'Story operation error';
    }

    return throwError(userMessage);
  };

  /**
   * Get asset stories
   * 
   * @param id 
   * @param titlequery 
   * @param ordering 
   * @param limit 
   * @param offset 
   * 
   */
  getAssetStories(id: any, titlequery: any, ordering: any, limit: number, offset: number): Observable<any> {
    return this.http
      .get<any>(`${this.assetsUrl}/${id}/stories?titlequery=${titlequery}&orderby=${ordering.field}&direction=${ordering.direction}&limit=${limit}&offset=${offset}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get story detail
   * 
   * @param id 
   * 
   */
  getStoryDetail(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.storiesUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get my stories (note: token is inserted by JWT interceptor)
   * @param titlequery 
   * @param ordering 
   * @param limit 
   * @param offset 
   */
  getMyStories(titlequery: any, ordering: any, limit: number, offset: number): Observable<any> {
    return this.http
      .get<any>(`${this.userStoriesUrl}?titlequery=${titlequery}&orderby=${ordering.field}&direction=${ordering.direction}&limit=${limit}&offset=${offset}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update story
   * @param id 
   * @param story 
   */
  updateStory(id, story): Observable<any> {
    return this.http.put<any>(`${this.storiesUrl}/${id}`, story, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new story
   * @param story 
   */
  createStory(story): Observable<any> {
    return this.http.post<any>(`${this.storiesUrl}`, story, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete story
   * @param id 
   */
  deleteStory(id): Observable<any> {
    return this.http.delete<any>(`${this.storiesUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Approve story
   * @param id 
   */
  approveStory(id): Observable<any> {
    return this.http.put<any>(`${this.storiesUrl}/${id}/approve`, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

}

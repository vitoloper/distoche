import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CulturalAssetService {

  assetsUrl = '/api/assets';

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
      userMessage = 'Cultural asset operation error';
    }

    return throwError(userMessage);
  };

  /**
   * GET beni culturali
   * 
   * @param namequery
   * @param boundaries
   * @param ordering 
   * @param limit 
   * @param offset
   * 
   */
  getAssets(namequery: any, boundaries: any, ordering: any, limit: number, offset: number): Observable<any> {
    // Get map bounding box coordinates
    let nlat = Number((boundaries._northEast.lat).toFixed(3));
    let slat = Number((boundaries._southWest.lat).toFixed(3));
    let elon = Number((boundaries._northEast.lng).toFixed(3));
    let wlon = Number((boundaries._southWest.lng).toFixed(3));

    return this.http
      .get<any>(`${this.assetsUrl}?nlata=${nlat}&slat=${slat}&elon=${elon}&wlon=${wlon}&namequery=${namequery}&orderby=${ordering.field}&direction=${ordering.direction}&limit=${limit}&offset=${offset}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAssetDetail(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.assetsUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

}

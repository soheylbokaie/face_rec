import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  private apiUrl = 'https://127.0.0.1:5000/'; // replace with your API endpoint

  constructor(private http: HttpClient) {}
  generate_token(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'generate_token', data);
  }
  send_Image(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'save_pic', data);
  }
  verfPicture(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'verf', data);
  }
}

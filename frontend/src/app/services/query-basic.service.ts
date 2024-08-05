import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'query/basic';
  }

  deleteOneRow(data: any): Observable<any> {
    return this.http.delete<string>(`${this.myAppUrl}${this.myApiUrl}/delete`, { body : data });
  }

  insertOneRow(data: any): Observable<any> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/insert`, data);
  }

  updateOneRow(data: any): Observable<any> {
    return this.http.put<string>(`${this.myAppUrl}${this.myApiUrl}/update`, data);
  }

}

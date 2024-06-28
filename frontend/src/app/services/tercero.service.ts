import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TerceroService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api';
  }

  getCodigo(codigo: string): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/create/${codigo}`);
  }

  postCodigo(data: object): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/create`, data);
  }

  getListaTerceros(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list`);
  }

}

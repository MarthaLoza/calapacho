import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Selector } from '../components/tercero/tercero.component';

@Injectable({
  providedIn: 'root'
})
export class AdressService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api';
  }
  
  /** Lista de departamentos */
  getDeparta(): Observable<Selector[]> {
    return this.http.get<Selector[]>(`${this.myAppUrl}${this.myApiUrl}/adress/departa`)
  }

  /** Lista de provincias segun departamento */
  postProvincia(coddep: string): Observable<Selector[]> {
    return this.http.post<Selector[]>(`${this.myAppUrl}${this.myApiUrl}/adress/provincia/${coddep}`, {})
  }

  /** Lista de distritos degun departamento y provincia */
  postDistrito(coddep: string, codprv: string): Observable<Selector[]> {
    return this.http.post<Selector[]>(`${this.myAppUrl}${this.myApiUrl}/adress/distrito/${coddep}/${codprv}`, {})
  }

}

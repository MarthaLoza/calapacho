import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { DirecTercero, DireccElement, TercerElement } from '../interfaces/user';

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

  getCodigo(cod: string): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/create/${cod}`);
  }

  postTercero(data: object): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/create`, data);
  }

  getListaTerceros(data: object): Observable<TercerElement[]> {
    return this.http.post<TercerElement[]>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list`, data);
  }

  getOneTercero(seqno: number): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list/${seqno}`, {});
  }

  getDireccionesTercero(data: object): Observable<DireccElement[]> {    
    return this.http.post<DireccElement[]>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/direcciones`, data);
  }

  getOneDireccionTercero(codigo: string, tipdir: number): Observable<DirecTercero> {
    return this.http.post<DirecTercero>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list/direccion/${codigo}/${tipdir}`, {});
  }

  putTercero(data: object, seqno: number): Observable<string> {
    return this.http.put<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/update/${seqno}`, data);
  }

  deleteTercero(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/delete/${codigo}`);
  }

}

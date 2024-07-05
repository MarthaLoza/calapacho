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

  getCodigo(codigo: string): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/create/${codigo}`);
  }

  postTercero(data: object): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/create`, data);
  }

  getListaTerceros(): Observable<TercerElement[]> {
    return this.http.get<TercerElement[]>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list`);
  }

  getOneTercero(seqno: number): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list/${seqno}`, {});
  }

  getDireccionesTercero(codigo: string): Observable<Array<DireccElement>> {
    return this.http.post<Array<DireccElement>>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list/direcciones/${codigo}`, {});
  }

  getOneDireccionTercero(codigo: string, tipdir: number): Observable<DirecTercero> {
    return this.http.post<DirecTercero>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/list/direccion/${codigo}/${tipdir}`, {});
  }

  putTercero(data: object, seqno: number): Observable<string> {
    return this.http.put<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/update/${seqno}`, data);
  }

  deleteTercero(seqno: number): Observable<string> {
    return this.http.delete<string>(`${this.myAppUrl}${this.myApiUrl}/tercero/user/delete/${seqno}`);
  }

}

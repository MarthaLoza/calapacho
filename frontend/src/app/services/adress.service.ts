import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getCodigo(): Observable<Selector[]> {
    return this.http.get<Selector[]>(`${this.myAppUrl}${this.myApiUrl}/adress/departa`);
  }

}

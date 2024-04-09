import { Component, OnInit } from '@angular/core';

interface cards {
  image: string;
  btn: string;
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  hora: string = '';
  minuto: string = '';
  segundo: string = '';
  ampm: string = '';

  constructor() { }

  ngOnInit(): void {
    this.actualizarHora();
    setInterval(() => this.actualizarHora(), 1000);
  }

  selected: Date | null | undefined = new Date();

  actualizarHora() {
    const ahora = new Date();
    const hora24 = ahora.getHours();
    const hora12 = hora24 % 12 || 12; // Convertir la hora de 24 a 12 horas
    const ampm = hora24 < 12 ? 'AM' : 'PM';
    this.hora = this.agregarCeros(hora12);
    this.minuto = this.agregarCeros(ahora.getMinutes());
    this.segundo = this.agregarCeros(ahora.getSeconds());
    this.ampm = ampm;
  }

  agregarCeros(valor: number): string {
    return valor < 10 ? '0' + valor : '' + valor;
  }

}

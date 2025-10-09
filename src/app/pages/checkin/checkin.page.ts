import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage {
  desafioDoDia = {
    titulo: 'Leia por 10 minutos hoje',
    emoji: '📚',
    categoria: 'Mente',
  };

  diasSeguidos = 5;
  fezHoje = false;
  experiencia = '';

  marcarComoFeito() {
    this.fezHoje = true;
    this.diasSeguidos++;
  }

  resetarSequencia() {
    this.diasSeguidos = 0;
    this.fezHoje = false;
  }
}

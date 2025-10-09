import { Injectable } from '@angular/core';

export interface Desafio {
  titulo: string;
  categoria: string;
  duracao: string;
  emoji: string;
}

@Injectable({ providedIn: 'root' })
export class DesafioService {
  private desafios: Desafio[] = [
    { titulo: 'Caminhe 1 km', categoria: 'Corpo', duracao: '10min', emoji: '🚶' },
    { titulo: 'Medite por 5min', categoria: 'Mente', duracao: '5min', emoji: '🧘' },
    { titulo: 'Leia por 15min', categoria: 'Foco', duracao: '15min', emoji: '📖' },
    { titulo: 'Beba 2 copos de água', categoria: 'Saúde', duracao: '2min', emoji: '💧' },
    { titulo: 'Escreva 3 gratidões', categoria: 'Mente', duracao: '10min', emoji: '📝' },
  ];

  getDesafioAleatorio() {
    return this.desafios[Math.floor(Math.random() * this.desafios.length)];
  }

  getTodosDesafios() {
    return this.desafios;
  }
}

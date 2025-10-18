import { Injectable } from '@angular/core';

export interface Desafio {
  titulo: string;
  categoria: string;
  tempo: string;
  emoji?: string;
  feito: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  pontos = 0;
  streak = 0;

  // 1 troca por sessão (poderia resetar por dia)
  trocaDisponivel = true;

  desafios: Desafio[] = [
    { titulo: 'Medite por 5min', categoria: 'Mente', tempo: '5min', emoji: '🧘', feito: false },
    { titulo: 'Beba 2 copos de água', categoria: 'Saúde', tempo: '2min', emoji: '💧', feito: false },
    { titulo: 'Caminhe 1km', categoria: 'Corpo', tempo: '10min', emoji: '🚶‍♂️', feito: false },
    { titulo: 'Trabalhe em silêncio 15min', categoria: 'Foco', tempo: '15min', emoji: '🎯', feito: false },
  ];

  currentIndex = 0;

  get desafioAtual(): Desafio {
    return this.desafios[this.currentIndex];
  }

  concluirDesafio(): boolean {
    const d = this.desafioAtual;
    if (d.feito) return false;
    d.feito = true;
    this.pontos += 10;
    this.streak += 1;
    return true;
  }

  trocarDesafio(): boolean {
    if (!this.trocaDisponivel) return false;
    let idx = this.currentIndex;
    while (idx === this.currentIndex) {
      idx = Math.floor(Math.random() * this.desafios.length);
    }
    this.currentIndex = idx;
    this.trocaDisponivel = false;
    return true;
  }
}

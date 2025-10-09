import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { DesafioService, Desafio } from 'src/app/services/desafio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel
  ],
})
export class HomePage implements OnInit {
  desafio: Desafio | null = null;
  pontos = 0;
  streak = 0;

  constructor(private desafioService: DesafioService) {}

  ngOnInit() {
    this.trocarDesafio();
  }

concluirDesafio() {
  console.log('✅ Concluiu desafio!');
  this.pontos += 10;
  this.streak += 1;
  this.trocarDesafio();
}

trocarDesafio() {
  console.log('🎲 Trocando desafio...');
  this.desafio = this.desafioService.getDesafioAleatorio();
}

}

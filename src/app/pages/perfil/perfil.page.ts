import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  pontos = 120;
  streak = 5;
  metasConcluidas = 4;
  desafiosConcluidos = 15;

  logout() {
    console.log('Saindo...');
    alert('Logout realizado com sucesso!');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './desafios.page.html',
  styleUrls: ['./desafios.page.scss'],
})
export class DesafiosPage {
  desafios = [
    { titulo: 'Medite por 5min 🧘', categoria: 'Mente', tempo: '5min', concluido: true },
    { titulo: 'Beba 2 copos de água 💧', categoria: 'Saúde', tempo: '2min', concluido: false },
    { titulo: 'Caminhe 1km 🚶‍♂️', categoria: 'Corpo', tempo: '10min', concluido: false },
  ];
}

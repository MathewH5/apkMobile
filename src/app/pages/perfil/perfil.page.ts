import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar saída',
      message: 'Tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sair',
          handler: () => {
            localStorage.clear();
            this.navCtrl.navigateRoot('/login'); // 👈 caminho corrigido
          }
        }
      ]
    });

    await alert.present();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';

import { AuthService } from '../../services/auth';
import { UserService, UserProfile } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  private afAuth = inject(Auth);
  private fs = inject(Firestore);
  private auth = inject(AuthService);
  private users = inject(UserService);
  private alert = inject(AlertController);
  private toast = inject(ToastController);
  private router = inject(Router);

  uid = '';
  profile$!: Observable<UserProfile | undefined>;

  ngOnInit() {
    onAuthStateChanged(this.afAuth, (user) => {
      if (!user) {
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return;
      }
      this.uid = user.uid;
      this.profile$ = docData(doc(this.fs, `users/${this.uid}`)) as Observable<UserProfile | undefined>;
    });
  }

  // ======== Foto por link ========
  async trocarFotoPorLink() {
    const a = await this.alert.create({
      header: 'Trocar foto',
      message: 'Cole o link direto da imagem (pode ser link de busca).',
      inputs: [{ name: 'url', type: 'url', placeholder: 'https://...' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data: any) => {
            const raw: string = (data?.url || '').trim();
            if (!raw) return false;

            const url = this.users.extractDirectImageUrl(raw);
            if (!this.users.isLikelyImageUrl(url)) {
              await this.showToast('Link inválido. Tente outro endereço de imagem.');
              return false;
            }
            try {
              await this.users.setPhotoURL(this.uid, url);
              await this.showToast('Foto atualizada!');
            } catch (e) {
              console.error(e);
              await this.showToast('Não foi possível salvar a foto.');
            }
            return true;
          },
        },
      ],
    });
    await a.present();
  }

  async removerFoto() {
    try {
      await this.users.setPhotoURL(this.uid, null);
      await this.showToast('Foto removida.');
    } catch {
      await this.showToast('Erro ao remover a foto.');
    }
  }

  // ======== Estatísticas: helpers usados no HTML ========
  weekSum(week?: number[]) {
    return (week ?? []).reduce((acc, n) => acc + n, 0);
  }

  todayCount(p?: UserProfile) {
    return p?.stats?.week?.[6] ?? 0;
  }

  dailyProgress(p?: UserProfile) {
    const goal = p?.stats?.dailyGoal || 1;
    return Math.min(1, this.todayCount(p) / goal);
  }

  // ======== UI ========
  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async showToast(msg: string) {
    const t = await this.toast.create({ message: msg, duration: 2200, position: 'bottom' });
    await t.present();
  }
}

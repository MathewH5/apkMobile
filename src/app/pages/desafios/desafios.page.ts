import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ChallengeService, Challenge } from '../../services/challenge.service';

@Component({
  selector: 'app-desafios',
  standalone: true,
  templateUrl: './desafios.page.html',
  styleUrls: ['./desafios.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class DesafiosPage {
  private auth = inject(AuthService);
  private svc = inject(ChallengeService);
  private toast = inject(ToastController);

  desafios$ = this.auth.user$.pipe(
    switchMap(u => (u ? this.svc.list$(u.uid) : of([])))
  );

  async addRandom() {
    const u = this.auth.currentUser();
    if (!u) return;
    await this.svc.addRandom(u.uid);
  }

  async toggle(d: Challenge, checked: boolean) {
    const u = this.auth.currentUser();
    if (!u || !d.id) return;
    await this.svc.setCompleted(u.uid, d.id, checked);
    (await this.toast.create({ message: checked ? 'Concluído! +10 pts' : 'Desfeito', duration: 1100 })).present();
  }

  async remove(d: Challenge) {
    const u = this.auth.currentUser();
    if (!u || !d.id) return;
    await this.svc.remove(u.uid, d.id);
  }
}

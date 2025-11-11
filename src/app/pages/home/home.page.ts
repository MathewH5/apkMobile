import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user.service';
import { ChallengeService, Challenge } from '../../services/challenge.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class HomePage {
  private auth = inject(AuthService);
  private users = inject(UserService);
  private chall = inject(ChallengeService);

  uid: string | null = null;

  // usuário do Firestore (para pontos/streak no rodapé)
  user$ = this.auth.user$.pipe(
    switchMap(u => (u ? this.users.userDoc$(u.uid) : of(undefined)))
  );

  // desafio atual (primeiro não concluído)
  desafio = signal<Challenge | null>(null);

  constructor() {
    this.auth.user$.pipe(
      switchMap(u => {
        this.uid = u?.uid ?? null;
        return u ? this.chall.list$(u.uid) : of([]);
      })
    ).subscribe(list => {
      const open = list.find(c => !c.completed);
      this.desafio.set(open ?? null);
    });
  }

async concluirDesafio() {
  const d = this.desafio();
  if (!d || !this.uid || !d.id) return;

  // 1) marca concluído
  await this.chall.setCompleted(this.uid, d.id, true);

  // 2) pontuação proporcional ao “esforço”
  const minutes = (d as any).minutes ?? 5;
  const deltaPoints = Math.max(5, Math.round(minutes * 2)); // ex.: 10–30 pts
  await this.users.bumpOnComplete(this.uid, deltaPoints);
}

  async trocarDesafio() {
    if (!this.uid) return;
    await this.chall.addRandom(this.uid);
  }
}

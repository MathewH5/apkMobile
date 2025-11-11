import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';                 // ✅ precisa para [(ngModel)]
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,                                              // ✅ adicionado
    IonicModule,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  private loadingRef?: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loading: LoadingController,
    private toast: ToastController
  ) {}

  private async showLoading(message: string) {
    this.loadingRef = await this.loading.create({ message });
    await this.loadingRef.present();
  }
  private async hideLoading() {
    try { await this.loadingRef?.dismiss(); } catch {}
  }
  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 2500, position: 'bottom' });
    await t.present();
  }

  async entrar() {
    await this.showLoading('Entrando...');
    try {
      const user = await this.auth.login({ email: this.email, password: this.password });
      if (!user) {
        await this.showToast('E-mail ou senha inválidos.');
        return;
      }
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (e: any) {
      console.error('Login error:', e);
      await this.showToast(mapFirebaseError(e));
    } finally {
      await this.hideLoading();                               // ✅ loading sempre fecha
    }
  }

  async criarConta() {
    await this.showLoading('Criando conta...');
    try {
      const user = await this.auth.register({ email: this.email, password: this.password });
      if (!user) {
        await this.showToast('Não foi possível criar a conta.');
        return;
      }
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (e: any) {
      console.error('Register error:', e);
      await this.showToast(mapFirebaseError(e));
    } finally {
      await this.hideLoading();
    }
  }
}

function mapFirebaseError(e: any) {
  const code = e?.code || '';
  if (code?.startsWith('auth/')) {
    switch (code) {
      case 'auth/invalid-email': return 'E-mail inválido.';
      case 'auth/user-not-found':
      case 'auth/wrong-password': return 'E-mail ou senha incorretos.';
      case 'auth/email-already-in-use': return 'E-mail já está em uso.';
      case 'auth/too-many-requests': return 'Muitas tentativas. Tente mais tarde.';
    }
  }
  if (code === 'permission-denied') return 'Regras do Firestore bloquearam o acesso.';
  return 'Ocorreu um erro. Tente novamente.';
}

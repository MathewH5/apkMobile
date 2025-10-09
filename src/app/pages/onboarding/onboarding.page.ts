import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, IonicModule, SwiperModule],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage {
  slides = [
    {
      title: 'Construa hábitos consistentes 💪',
      desc: 'Transforme pequenas ações diárias em grandes conquistas. Desenvolva disciplina e foco com desafios personalizados.',
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800',
    },
    {
      title: 'Receba desafios diários 🎯',
      desc: 'Cada dia, uma nova oportunidade de evoluir. Desafios leves e motivadores para manter o ritmo.',
      img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800',
    },
    {
      title: 'Transforme esforço em conquistas 🚀',
      desc: 'Acompanhe seu progresso, ganhe pontos e suba de nível. Você no controle do seu foco.',
      img: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=800',
    },
  ];

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}

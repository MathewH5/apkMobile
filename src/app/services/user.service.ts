import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, docData, getDoc, setDoc, updateDoc, increment
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserStats {
  completedCount: number;
  streak: number;
  longestStreak: number;
  lastDay?: string;   // 'YYYY-MM-DD' da última conclusão
  week: number[];     // janela rolante de 7 dias (sempre length 7)
  dailyGoal: number;  // meta diária (ex.: 1 desafio/dia)
}

export interface UserProfile {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  points: number;
  stats: UserStats;
}

const DEFAULT_STATS: UserStats = {
  completedCount: 0,
  streak: 0,
  longestStreak: 0,
  week: [0, 0, 0, 0, 0, 0, 0],
  dailyGoal: 1
};

// ---------- helpers de data (hábito diário) ----------
function dayKey(d = new Date()) {
  // YYYY-MM-DD (usando data local — suficiente para hábito diário)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function daysBetween(a?: string, b?: string) {
  if (!a || !b) return Infinity;
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((+db - +da) / 86400000);
}

function rotateWeek(week: number[], gap: number) {
  // desloca à esquerda e zera posições que “entraram”
  const g = Math.max(1, Math.min(7, gap)); // pelo menos 1 dia passou
  const copy = week.slice();
  for (let i = 0; i < g; i++) {
    copy.shift();
    copy.push(0);
  }
  return copy;
}
// -----------------------------------------------------

@Injectable({ providedIn: 'root' })
export class UserService {
  private fs = inject(Firestore);

  // -------- leitura do perfil --------
  userDoc$(uid: string): Observable<UserProfile | undefined> {
    return docData(doc(this.fs, `users/${uid}`)) as Observable<UserProfile | undefined>;
  }

  // -------- criação/merge do perfil --------
async ensureUser(uid: string, profile: Partial<UserProfile> = {}) {
  const ref = doc(this.fs, `users/${uid}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // cria com defaults
    const data: UserProfile = {
      displayName: profile.displayName ?? null,
      email: profile.email ?? null,
      photoURL: profile.photoURL ?? null,
      points: 0,
      stats: { ...DEFAULT_STATS }
    };
    await setDoc(ref, data, { merge: true });
    return;
  }

  // doc já existe → só atualiza campos com valor NÃO nulo/indefinido
  const update: any = {};
  for (const [k, v] of Object.entries(profile)) {
    if (v !== undefined && v !== null) {
      update[k] = v;
    }
  }
  if (Object.keys(update).length) {
    await setDoc(ref, update, { merge: true });
  }
}


  // -------- foto por URL (string no Firestore) --------
  async setPhotoURL(uid: string, url: string | null) {
    await updateDoc(doc(this.fs, `users/${uid}`), { photoURL: url });
  }

  /** Extrai URL direta quando link vem de buscadores (Google/Brave/Bing). */
  extractDirectImageUrl(raw: string): string {
    try {
      const u = new URL(raw);
      // Google Images: .../imgres?imgurl=<REAL>&...
      if (u.hostname.includes('google.') && u.pathname.includes('/imgres') && u.searchParams.has('imgurl')) {
        return u.searchParams.get('imgurl')!;
      }
      // Brave/Bing/CDNs geralmente já apontam para a imagem final.
      return raw;
    } catch {
      return raw;
    }
  }

  /** Validação simples: precisa ser http/https; extensões ajudam, mas aceitamos CDNs sem extensão. */
  isLikelyImageUrl(url: string): boolean {
    if (!/^https?:\/\//i.test(url)) return false;
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(url) || true;
  }

  // -------- estatísticas: concluir desafio --------
  // - streak real (incrementa em dias consecutivos; quebra se pular 1+ dias)
  // - longestStreak (recorde)
  // - janela semanal rolante (week[6] = hoje)
  // - pontos incrementais
  async bumpOnComplete(uid: string, deltaPoints = 10) {
    const ref = doc(this.fs, `users/${uid}`);
    const snap = await getDoc(ref);
    const current = snap.exists() ? (snap.data() as UserProfile) : null;

    const today = dayKey();
    let stats: UserStats = current?.stats ? { ...DEFAULT_STATS, ...current.stats } : { ...DEFAULT_STATS };

    // rolamento da semana conforme gap desde a última conclusão
    const gap = daysBetween(stats.lastDay, today);
    if (gap >= 1 && gap < Infinity) {
      stats.week = rotateWeek(stats.week, gap);
    }

    // streak
    if (!stats.lastDay || gap > 1) {
      stats.streak = 1;                 // quebrou sequência
    } else if (gap === 1) {
      stats.streak = stats.streak + 1;  // continuação
    } // gap === 0 → não altera streak

    stats.longestStreak = Math.max(stats.longestStreak, stats.streak);
    stats.completedCount += 1;
    stats.lastDay = today;

    // “hoje” é sempre índice 6 após o rotate
    stats.week[6] = (stats.week[6] ?? 0) + 1;

    await updateDoc(ref, {
      points: increment(deltaPoints),
      stats
    });
  }

  // -------- estatísticas: desfazer conclusão --------
  // Mantém a experiência simples:
  // - decrementa pontos
  // - decrementa completedCount
  // - se foi hoje, decrementa a “caixinha” do dia
  // - não mexe no streak (evita edge cases confusos para o usuário)
  async revertOnUncomplete(uid: string, deltaPoints = 10) {
    const ref = doc(this.fs, `users/${uid}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data() as UserProfile;
    const stats: UserStats = { ...DEFAULT_STATS, ...data.stats };
    const today = dayKey();

    if (stats.lastDay === today && (stats.week?.[6] ?? 0) > 0) {
      stats.week[6] = Math.max(0, (stats.week[6] ?? 0) - 1);
      stats.completedCount = Math.max(0, stats.completedCount - 1);
    } else {
      stats.completedCount = Math.max(0, stats.completedCount - 1);
    }

    await updateDoc(ref, {
      points: increment(-deltaPoints),
      stats
    });
  }
}

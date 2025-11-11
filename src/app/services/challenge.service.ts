import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

export interface Challenge {
  id?: string;
  title: string;
  category: string;
  minutes: number;
  emoji?: string;
  completed: boolean;
  createdAt?: any;
  completedAt?: any;
}

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  constructor(private fs: Firestore, private users: UserService) {}

  list$(uid: string): Observable<Challenge[]> {
    const col = collection(this.fs, `users/${uid}/challenges`);
    const q = query(col, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Challenge[]>;
    }

  async addRandom(uid: string) {
    const presets: Omit<Challenge, 'id'>[] = [
      { title: 'Escreva 3 gratidões', category: 'Mente', minutes: 10, emoji: '📝', completed: false },
      { title: 'Medite por 5min',       category: 'Mente', minutes: 5,  emoji: '🧘', completed: false },
      { title: 'Caminhe 1km',           category: 'Corpo', minutes: 10, emoji: '🚶', completed: false },
      { title: 'Água 300ml',            category: 'Saúde', minutes: 2,  emoji: '💧', completed: false },
    ];
    const d = presets[Math.floor(Math.random() * presets.length)];
    await addDoc(collection(this.fs, `users/${uid}/challenges`), { ...d, createdAt: serverTimestamp() });
  }

  async remove(uid: string, id: string) {
    await deleteDoc(doc(this.fs, `users/${uid}/challenges/${id}`));
  }

  async setCompleted(uid: string, id: string, done: boolean) {
    const cref = doc(this.fs, `users/${uid}/challenges/${id}`);
    await updateDoc(cref, { completed: done, completedAt: done ? serverTimestamp() : null });
    if (done) await this.users.bumpOnComplete(uid, 10);
    else      await this.users.revertOnUncomplete(uid, 10);
  }
}

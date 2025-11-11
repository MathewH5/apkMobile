import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, serverTimestamp, query, where, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Challenge {
  id?: string;
  title: string;
  category: string;   // 'Mente' | 'Saúde' | 'Corpo' | ...
  minutes: number;
  status: 'pending' | 'done';
  doneAt?: any;
}

@Injectable({ providedIn: 'root' })
export class DesafioService {
  constructor(private fs: Firestore) {}

  list$(uid: string): Observable<Challenge[]> {
    const col = collection(this.fs, `users/${uid}/challenges`);
    return collectionData(col, { idField: 'id' }) as Observable<Challenge[]>;
  }

  listByStatus$(uid: string, status: 'pending' | 'done') {
    const col = collection(this.fs, `users/${uid}/challenges`);
    const q = query(col, where('status', '==', status));
    return collectionData(q, { idField: 'id' }) as Observable<Challenge[]>;
  }

  async add(uid: string, c: Omit<Challenge, 'id' | 'status'>) {
    const col = collection(this.fs, `users/${uid}/challenges`);
    await addDoc(col, { ...c, status: 'pending' });
  }

  async markDone(uid: string, id: string) {
    await updateDoc(doc(this.fs, `users/${uid}/challenges/${id}`), {
      status: 'done', doneAt: serverTimestamp()
    });
  }

  async markPending(uid: string, id: string) {
    await updateDoc(doc(this.fs, `users/${uid}/challenges/${id}`), {
      status: 'pending', doneAt: null
    });
  }

  async remove(uid: string, id: string) {
    await deleteDoc(doc(this.fs, `users/${uid}/challenges/${id}`));
  }
}

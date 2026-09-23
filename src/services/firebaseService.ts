import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { InstagramAccount, ProxyConfig, TargetingConfig, AutomationConfig, ActivityLog } from '../types';

export const firebaseService = {
  // Load or sync accounts
  async loadAccounts(userId: string): Promise<InstagramAccount[]> {
    try {
      const colRef = collection(db, 'users', userId, 'accounts');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        return [];
      }
      return snap.docs.map((d) => d.data() as InstagramAccount);
    } catch (err) {
      console.warn('Error loading accounts from Firestore:', err);
      return [];
    }
  },

  async saveAccount(userId: string, account: InstagramAccount): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'accounts', account.id);
      await setDoc(docRef, account, { merge: true });
    } catch (err) {
      console.warn('Error saving account to Firestore:', err);
    }
  },

  async deleteAccount(userId: string, accountId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'accounts', accountId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Error deleting account from Firestore:', err);
    }
  },

  // Proxies
  async loadProxies(userId: string): Promise<ProxyConfig[]> {
    try {
      const colRef = collection(db, 'users', userId, 'proxies');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        return [];
      }
      return snap.docs.map((d) => d.data() as ProxyConfig);
    } catch (err) {
      console.warn('Error loading proxies from Firestore:', err);
      return [];
    }
  },

  async saveProxy(userId: string, proxy: ProxyConfig): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'proxies', proxy.id);
      await setDoc(docRef, proxy, { merge: true });
    } catch (err) {
      console.warn('Error saving proxy to Firestore:', err);
    }
  },

  async deleteProxy(userId: string, proxyId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'proxies', proxyId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Error deleting proxy from Firestore:', err);
    }
  },

  // Save an activity log
  async addActivityLog(userId: string, log: ActivityLog): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'logs', log.id);
      await setDoc(docRef, log);
    } catch (err) {
      console.warn('Error saving log to Firestore:', err);
    }
  },

  // Save automation & targeting configs
  async saveConfig(userId: string, accountId: string, targeting: TargetingConfig, automation: AutomationConfig): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'accounts', accountId, 'config', 'settings');
      await setDoc(docRef, { targeting, automation }, { merge: true });
    } catch (err) {
      console.warn('Error saving configs to Firestore:', err);
    }
  }
};

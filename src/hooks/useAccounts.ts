// src/hooks/useAccounts.ts

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

// 1. Tipagem para uma Conta Bancária
export interface BankAccount {
  id: string;
  userId: string;
  name: string;
  color: string; // Cor em formato hexadecimal, ex: "#FF5733"
}

export const useAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. READ: Lógica para buscar as contas em tempo real
  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const accountsRef = collection(db, 'accounts');
    const q = query(accountsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAccounts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as BankAccount[];
      setAccounts(fetchedAccounts);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar contas:", err);
      setError("Falha ao carregar as contas.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. CREATE: Lógica para adicionar uma nova conta
  const addAccount = useCallback(async (accountData: Omit<BankAccount, 'id' | 'userId'>) => {
    if (!user) return Promise.reject("Usuário não autenticado.");
    try {
      await addDoc(collection(db, 'accounts'), {
        ...accountData,
        userId: user.uid,
      });
    } catch (e) {
      console.error("Erro ao adicionar conta:", e);
      return Promise.reject(e);
    }
  }, [user]);

  // 4. DELETE: Lógica para excluir uma conta
  const deleteAccount = useCallback(async (accountId: string) => {
    if (!user) return Promise.reject("Usuário não autenticado.");
    try {
      await deleteDoc(doc(db, 'accounts', accountId));
    } catch (e) {
      console.error("Erro ao excluir conta:", e);
      return Promise.reject(e);
    }
  }, [user]);
  
  // 5. UPDATE: Lógica para atualizar uma conta (cor, nome)
  const updateAccount = useCallback(async (accountId: string, updates: Partial<Omit<BankAccount, 'id' | 'userId'>>) => {
    if (!user) return Promise.reject("Usuário não autenticado.");
    try {
      await updateDoc(doc(db, 'accounts', accountId), updates);
    } catch (e) {
      console.error("Erro ao atualizar conta:", e);
      return Promise.reject(e);
    }
  }, [user]);


  return { accounts, loading, error, addAccount, deleteAccount, updateAccount };
};

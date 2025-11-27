// src/hooks/useAccounts.ts - VERSÃO FINAL COMPLETA

'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export interface Account {
  id: string;
  userId: string;
  name: string;
  color: string;
}

interface NewAccountData {
  name: string;
  color: string;
}

export const useAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const accountsRef = collection(db, 'accounts');
    const q = query(
      accountsRef, 
      where('userId', '==', user.uid),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAccounts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Account[];
      
      setAccounts(fetchedAccounts);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar contas:", err);
      setError("Falha ao carregar as contas.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addAccount = useCallback(
    async (accountData: NewAccountData) => {
      if (!user) {
        setError('Usuário não autenticado.');
        throw new Error('Usuário não autenticado.');
      }
      try {
        await addDoc(collection(db, 'accounts'), {
          userId: user.uid,
          name: accountData.name,
          color: accountData.color,
        });
        toast.success('Conta adicionada com sucesso!');
      } catch (e) {
        console.error('Erro ao adicionar conta:', e);
        toast.error('Falha ao adicionar conta.');
        throw e;
      }
    },
    [user]
  );

  const deleteAccount = useCallback(
    async (id: string) => {
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }
      try {
        const accountRef = doc(db, 'accounts', id);
        await deleteDoc(accountRef);
        toast.success('Conta excluída com sucesso!');
      } catch (e) {
        console.error('Erro ao excluir conta:', e);
        toast.error('Falha ao excluir conta.');
        throw e;
      }
    },
    [user]
  );

  return {
    accounts,
    loading,
    error,
    addAccount,
    deleteAccount,
  };
};

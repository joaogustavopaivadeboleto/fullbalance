// src/hooks/useAccounts.ts - VERSÃO FINAL COMPLETA

'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

export interface Account {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export const useAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- INÍCIO DA CORREÇÃO ---
  // Este é o useEffect completo e correto
  useEffect(() => {
    // Se não há usuário, não faz nada e para de carregar
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true); // Inicia o carregamento

    // Cria a query para buscar as contas do usuário logado, ordenadas por nome
    const accountsRef = collection(db, 'accounts');
    const q = query(
      accountsRef, 
      where('userId', '==', user.uid),
      orderBy('name', 'asc') // Ordena as contas por nome
    );

    // Ouve as mudanças em tempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAccounts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Account[];
      
      setAccounts(fetchedAccounts);
      setLoading(false); // PARA de carregar em caso de sucesso
    }, (err) => {
      console.error("Erro ao buscar contas:", err);
      setError("Falha ao carregar as contas.");
      setLoading(false); // PARA de carregar em caso de erro
    });

    // Limpa o listener ao desmontar o componente para evitar vazamento de memória
    return () => unsubscribe();
  }, [user]); // O efeito só roda novamente se o objeto 'user' mudar
  // --- FIM DA CORREÇÃO ---

  const addAccount = useCallback(
    async (name: string, color: string) => {
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }
      try {
        await addDoc(collection(db, 'accounts'), {
          userId: user.uid,
          name,
          color,
        });
      } catch (e) {
        console.error('Erro ao adicionar conta:', e);
        setError('Falha ao adicionar conta.');
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
      } catch (e) {
        console.error('Erro ao excluir conta:', e);
        setError('Falha ao excluir conta.');
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

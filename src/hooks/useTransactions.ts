// src/hooks/useTransactions.ts

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

// 1. Tipagem para uma única Transação
export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  date: Timestamp;
  type: 'income' | 'expense';
  category: string;
  accountId: string;
}

export const useTransactions = (filter?: { accountId?: string }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- INÍCIO DA CORREÇÃO ---
  // Extrai o valor primitivo (string) do objeto de filtro.
  // Isso evita que o useEffect entre em loop infinito.
  const accountId = filter?.accountId;

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const transactionsRef = collection(db, 'transactions');
    
    let queryConstraints = [
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    ];

    // Adiciona o filtro de conta SE um accountId for fornecido
    if (accountId) {
      queryConstraints.push(where('accountId', '==', accountId));
    }

    const q = query(transactionsRef, ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(fetchedTransactions);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar transações:", err);
      setError("Falha ao carregar as transações.");
      setLoading(false);
    });

    return () => unsubscribe();
  // A dependência agora é a string 'accountId', que é estável entre renderizações.
  }, [user, accountId]); 
  // --- FIM DA CORREÇÃO ---

  // CREATE: Lógica para adicionar uma nova transação
  const addTransaction = useCallback(
    async (newTransaction: Omit<Transaction, 'id' | 'userId'>) => {
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }
      try {
        await addDoc(collection(db, 'transactions'), {
          ...newTransaction,
          userId: user.uid,
        });
      } catch (e) {
        console.error('Erro ao adicionar transação:', e);
        setError('Falha ao adicionar transação.');
      }
    },
    [user]
  );

  // UPDATE: Lógica para atualizar uma transação
  const updateTransaction = useCallback(
    async (id: string, updatedFields: Partial<Omit<Transaction, 'id' | 'userId'>>) => {
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }
      try {
        const transactionRef = doc(db, 'transactions', id);
        await updateDoc(transactionRef, updatedFields);
      } catch (e) {
        console.error('Erro ao atualizar transação:', e);
        setError('Falha ao atualizar transação.');
      }
    },
    [user]
  );

  // DELETE: Lógica para excluir uma transação
  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }
      try {
        const transactionRef = doc(db, 'transactions', id);
        await deleteDoc(transactionRef);
      } catch (e) {
        console.error('Erro ao excluir transação:', e);
        setError('Falha ao excluir transação.');
      }
    },
    [user]
  );

  // Retorna tudo que os componentes precisarão
  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

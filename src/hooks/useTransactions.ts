// src/hooks/useTransactions.ts - VERSÃO FINAL COMPLETA

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
import toast from 'react-hot-toast';

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

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const transactionsRef = collection(db, 'transactions');
    
    const q = query(
      transactionsRef,
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

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
  }, [user]); 

  const addTransaction = useCallback(
    async (newTransaction: Omit<Transaction, 'id' | 'userId'>) => {
      if (!user) {
        setError('Usuário não autenticado.');
        throw new Error('Usuário não autenticado.');
      }
      try {
        await addDoc(collection(db, 'transactions'), {
          ...newTransaction,
          userId: user.uid,
        });
        toast.success('Transação adicionada com sucesso!');
      } catch (e) {
        console.error('Erro ao adicionar transação:', e);
        toast.error('Falha ao adicionar transação.');
        throw e;
      }
    },
    [user]
  );

  const updateTransaction = useCallback(
    async (id: string, updatedFields: Partial<Omit<Transaction, 'id' | 'userId'>>) => {
      if (!user) {
        setError('Usuário não autenticado.');
        throw new Error('Usuário não autenticado.');
      }
      try {
        const transactionRef = doc(db, 'transactions', id);
        await updateDoc(transactionRef, updatedFields);
        toast.success('Transação atualizada com sucesso!');
      } catch (e) {
        console.error('Erro ao atualizar transação:', e);
        toast.error('Falha ao atualizar transação.');
        throw e;
      }
    },
    [user]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) {
        setError('Usuário não autenticado.');
        throw new Error('Usuário não autenticado.');
      }
      try {
        const transactionRef = doc(db, 'transactions', id);
        await deleteDoc(transactionRef);
        toast.success('Transação excluída com sucesso!');
      } catch (e) {
        console.error('Erro ao excluir transação:', e);
        toast.error('Falha ao excluir transação.');
        throw e;
      }
    },
    [user]
  );

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

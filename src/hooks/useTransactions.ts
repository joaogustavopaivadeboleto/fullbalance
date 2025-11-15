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

// A interface Transaction não muda
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

// Define a estrutura do objeto de filtro que o hook pode receber
interface TransactionsFilter {
  accountId?: string;
  type?: 'income' | 'expense';
}

// O hook agora aceita um filtro com accountId e/ou type
export const useTransactions = (filter?: TransactionsFilter) => {
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
    
    // Inicia a construção da query com as restrições padrão
    let queryConstraints: any[] = [
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    ];

    // Adiciona o filtro de conta SE ele for fornecido
    if (filter?.accountId) {
      queryConstraints.push(where('accountId', '==', filter.accountId));
    }

    // Adiciona o filtro de tipo SE ele for fornecido
    if (filter?.type) {
      queryConstraints.push(where('type', '==', filter.type));
    }

    // Monta a query final com todas as restrições
    const q = query(transactionsRef, ...queryConstraints);

    // Ouve as mudanças em tempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(fetchedTransactions);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar transações:", err);
      setError("Falha ao carregar as transações. Verifique o console para um link de criação de índice do Firestore.");
      setLoading(false);
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  // Usamos JSON.stringify para criar uma dependência estável a partir do objeto de filtro.
  // O efeito só será re-executado se os valores do filtro realmente mudarem.
  }, [user, JSON.stringify(filter)]); 

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

  // Retorna os dados e as funções para serem usados nos componentes
  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

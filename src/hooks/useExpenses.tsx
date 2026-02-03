import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  payee: string;
  notes: string | null;
  date: string;
  created_at: string;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  payee: string;
  notes?: string;
  date: string;
}

export const useExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('حدث خطأ في تحميل المصروفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const addExpense = async (expense: ExpenseInput) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setExpenses(prev => [data, ...prev]);
      toast.success('تمت إضافة المصروف بنجاح');
      return data;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('حدث خطأ في إضافة المصروف');
      throw error;
    }
  };

  const updateExpense = async (id: string, expense: Partial<ExpenseInput>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setExpenses(prev => prev.map(e => e.id === id ? data : e));
      toast.success('تم تحديث المصروف بنجاح');
      return data;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('حدث خطأ في تحديث المصروف');
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('تم حذف المصروف بنجاح');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('حدث خطأ في حذف المصروف');
      throw error;
    }
  };

  const getMonthlyTotal = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return expenses
      .filter(e => new Date(e.date) >= startOfMonth)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    return totals;
  };

  const getPayeeTotals = () => {
    const totals: Record<string, number> = {};
    expenses.forEach(e => {
      totals[e.payee] = (totals[e.payee] || 0) + Number(e.amount);
    });
    return Object.entries(totals)
      .map(([payee, amount]) => ({ payee, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthlyTotal,
    getCategoryTotals,
    getPayeeTotals,
    refetch: fetchExpenses,
  };
};

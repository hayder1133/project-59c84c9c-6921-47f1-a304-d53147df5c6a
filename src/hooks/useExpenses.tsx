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
  is_paid: boolean;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  payee: string;
  notes?: string;
  date: string;
  is_paid?: boolean;
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
      // For debt category, set is_paid to false by default
      const is_paid = expense.category === 'debt' ? false : true;
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          user_id: user.id,
          is_paid,
        })
        .select()
        .single();

      if (error) throw error;
      
      setExpenses(prev => [data, ...prev]);
      toast.success(expense.category === 'debt' ? 'تمت إضافة الدين بنجاح' : 'تمت إضافة المصروف بنجاح');
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
      // Exclude unpaid debts from monthly total
      .filter(e => !(e.category === 'debt' && !e.is_paid))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  const settleDebt = async (debt: Expense) => {
    if (!user || debt.category !== 'debt') return;

    try {
      // Mark the debt as paid
      const { error } = await supabase
        .from('expenses')
        .update({ is_paid: true, date: new Date().toISOString().split('T')[0] })
        .eq('id', debt.id);

      if (error) throw error;
      
      // Update local state
      setExpenses(prev => prev.map(e => 
        e.id === debt.id 
          ? { ...e, is_paid: true, date: new Date().toISOString().split('T')[0] } 
          : e
      ));
      
      toast.success(`تم تسديد دين ${debt.payee} بنجاح`);
    } catch (error) {
      console.error('Error settling debt:', error);
      toast.error('حدث خطأ في تسديد الدين');
      throw error;
    }
  };

  const getDebts = () => {
    return expenses.filter(e => e.category === 'debt');
  };

  const getUnpaidDebtsTotal = () => {
    return expenses
      .filter(e => e.category === 'debt' && !e.is_paid)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  const getUnpaidDebtsCount = () => {
    return expenses.filter(e => e.category === 'debt' && !e.is_paid).length;
  };

  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    // Only count paid expenses (exclude unpaid debts)
    expenses
      .filter(e => !(e.category === 'debt' && !e.is_paid))
      .forEach(e => {
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
    settleDebt,
    getMonthlyTotal,
    getCategoryTotals,
    getPayeeTotals,
    getDebts,
    getUnpaidDebtsTotal,
    getUnpaidDebtsCount,
    refetch: fetchExpenses,
  };
};

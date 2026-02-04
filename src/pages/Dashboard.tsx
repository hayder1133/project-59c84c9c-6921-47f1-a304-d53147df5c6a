import { useState } from 'react';
import { useExpenses, Expense, ExpenseInput } from '@/hooks/useExpenses';
import Header from '@/components/Dashboard/Header';
import MonthlyStats from '@/components/Dashboard/MonthlyStats';
import SearchBar from '@/components/Dashboard/SearchBar';
import TabNavigation from '@/components/Dashboard/TabNavigation';
import CategoryFilter from '@/components/Dashboard/CategoryFilter';
import ExpenseList from '@/components/Dashboard/ExpenseList';
import DebtList from '@/components/Dashboard/DebtList';
import DebtStats from '@/components/Dashboard/DebtStats';
import Reports from '@/components/Dashboard/Reports';
import FloatingButton from '@/components/Dashboard/FloatingButton';
import ExpenseForm from '@/components/Dashboard/ExpenseForm';
import DeleteConfirmDialog from '@/components/Dashboard/DeleteConfirmDialog';
import { Loader2 } from 'lucide-react';

type Tab = 'history' | 'debts' | 'reports';

const Dashboard = () => {
  const {
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
  } = useExpenses();

  const [activeTab, setActiveTab] = useState<Tab>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddExpense = async (data: ExpenseInput) => {
    await addExpense(data);
  };

  const handleUpdateExpense = async (data: ExpenseInput) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  const handleSettleDebt = async (debt: Expense) => {
    await settleDebt(debt);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="container py-4 space-y-4">
        {activeTab === 'debts' ? (
          <DebtStats 
            totalUnpaid={getUnpaidDebtsTotal()} 
            unpaidCount={getUnpaidDebtsCount()} 
          />
        ) : (
          <MonthlyStats total={getMonthlyTotal()} />
        )}
        
        {activeTab === 'history' && (
          <>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter 
              selectedCategory={categoryFilter} 
              onCategoryChange={setCategoryFilter} 
            />
          </>
        )}
        
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          unpaidDebtsCount={getUnpaidDebtsCount()}
        />

        {activeTab === 'history' && (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
          />
        )}

        {activeTab === 'debts' && (
          <DebtList
            debts={getDebts()}
            onSettle={handleSettleDebt}
            onDelete={handleDeleteClick}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            categoryTotals={getCategoryTotals()}
            payeeTotals={getPayeeTotals()}
          />
        )}
      </main>

      <FloatingButton onClick={() => setShowForm(true)} />

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          onClose={handleCloseForm}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Dashboard;

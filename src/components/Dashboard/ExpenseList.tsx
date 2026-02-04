import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Expense } from '@/hooks/useExpenses';
import { formatCurrency, formatDate, getCategoryLabel, CATEGORY_COLORS } from '@/lib/constants';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  categoryFilter: string | null;
}

const ExpenseList = ({ expenses, onEdit, onDelete, searchQuery, categoryFilter }: ExpenseListProps) => {
  // Filter out debts - they have their own tab
  const nonDebtExpenses = expenses.filter(e => e.category !== 'debt');
  
  const filteredExpenses = nonDebtExpenses.filter(expense => {
    const matchesSearch = expense.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === null || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (filteredExpenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مصروفات بعد'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredExpenses.map((expense, index) => (
        <div
          key={expense.id}
          className="expense-item animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className="w-3 h-3 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#6B7280' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground truncate">
                    {expense.payee}
                  </h3>
                  <span className="font-bold text-foreground amount whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-md text-xs">
                    {getCategoryLabel(expense.category)}
                  </span>
                  <span>{formatDate(expense.date)}</span>
                </div>
                {expense.notes && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {expense.notes}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                onClick={() => onEdit(expense)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(expense.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;

import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Expense } from '@/hooks/useExpenses';
import { formatCurrency, formatDate } from '@/lib/constants';

interface DebtListProps {
  debts: Expense[];
  onSettle: (debt: Expense) => void;
  onDelete: (id: string) => void;
}

const DebtList = ({ debts, onSettle, onDelete }: DebtListProps) => {
  const unpaidDebts = debts.filter(d => !d.is_paid);
  const paidDebts = debts.filter(d => d.is_paid);

  if (debts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        لا توجد ديون مسجلة
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unpaid Debts Section */}
      {unpaidDebts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            ديون غير مسددة ({unpaidDebts.length})
          </h3>
          {unpaidDebts.map((debt, index) => (
            <div
              key={debt.id}
              className="debt-item bg-destructive/5 border border-destructive/20 rounded-xl p-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-foreground truncate">
                      {debt.payee}
                    </h3>
                    <span className="font-bold text-destructive amount whitespace-nowrap">
                      {formatCurrency(debt.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-destructive/10 text-destructive rounded-md text-xs">
                      غير مسدد
                    </span>
                    <span>{formatDate(debt.date)}</span>
                  </div>
                  {debt.notes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {debt.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1"
                    onClick={() => onSettle(debt)}
                  >
                    <Check className="w-4 h-4" />
                    تسديد
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(debt.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paid Debts Section */}
      {paidDebts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            ديون مسددة ({paidDebts.length})
          </h3>
          {paidDebts.map((debt, index) => (
            <div
              key={debt.id}
              className="debt-item bg-muted/50 border border-border rounded-xl p-4 opacity-70"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-foreground truncate line-through">
                      {debt.payee}
                    </h3>
                    <span className="font-bold text-muted-foreground amount whitespace-nowrap">
                      {formatCurrency(debt.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs">
                      مسدد ✓
                    </span>
                    <span>{formatDate(debt.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebtList;

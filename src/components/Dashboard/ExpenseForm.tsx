import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/constants';
import { Expense, ExpenseInput } from '@/hooks/useExpenses';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: ExpenseInput) => Promise<void>;
  onClose: () => void;
}

const ExpenseForm = ({ expense, onSubmit, onClose }: ExpenseFormProps) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [payee, setPayee] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setPayee(expense.payee);
      setNotes(expense.notes || '');
      setDate(expense.date);
    }
  }, [expense]);

  const getPayeeLabel = () => {
    if (category === 'debt') return 'اسم الشخص';
    return 'اسم المحل / المستلم';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !payee || !date) return;

    setLoading(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        category,
        payee,
        notes: notes || undefined,
        date,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl border border-border shadow-xl animate-slide-up max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {expense ? 'تعديل المصروف' : 'إضافة مصروف جديد'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ (د.ع)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="25000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg"
              dir="ltr"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">التصنيف</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payee">{getPayeeLabel()}</Label>
            <Input
              id="payee"
              type="text"
              placeholder={category === 'debt' ? 'أحمد محمد' : 'سوق الخير'}
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">التفاصيل (اختياري)</Label>
            <Textarea
              id="notes"
              placeholder="تفاصيل إضافية..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12"
              dir="ltr"
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : expense ? (
              'تحديث المصروف'
            ) : (
              'إضافة المصروف'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;

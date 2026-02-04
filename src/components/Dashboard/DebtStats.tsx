import { AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';

interface DebtStatsProps {
  totalUnpaid: number;
  unpaidCount: number;
}

const DebtStats = ({ totalUnpaid, unpaidCount }: DebtStatsProps) => {
  return (
    <div className="stat-card bg-destructive/5 border-destructive/20 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm">إجمالي الديون غير المسددة</span>
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-destructive" />
        </div>
      </div>
      <p className="text-3xl font-bold text-destructive amount">
        {formatCurrency(totalUnpaid)}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {unpaidCount} {unpaidCount === 1 ? 'دين' : 'ديون'} غير مسددة
      </p>
    </div>
  );
};

export default DebtStats;

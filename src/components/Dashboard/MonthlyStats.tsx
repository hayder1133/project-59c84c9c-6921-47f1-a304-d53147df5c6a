import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';

interface MonthlyStatsProps {
  total: number;
}

const MonthlyStats = ({ total }: MonthlyStatsProps) => {
  const currentMonth = new Intl.DateTimeFormat('ar-IQ', { month: 'long' }).format(new Date());

  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm">إجمالي مصروفات {currentMonth}</span>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground amount">
        {formatCurrency(total)}
      </p>
    </div>
  );
};

export default MonthlyStats;

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, getCategoryLabel, CATEGORY_COLORS } from '@/lib/constants';

interface ReportsProps {
  categoryTotals: Record<string, number>;
  payeeTotals: { payee: string; amount: number }[];
}

const Reports = ({ categoryTotals, payeeTotals }: ReportsProps) => {
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: getCategoryLabel(category),
    value: amount,
    color: CATEGORY_COLORS[category] || '#6B7280',
  }));

  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {/* Category Chart */}
      <div className="card-elevated p-4">
        <h3 className="font-semibold text-foreground mb-4">المصروفات حسب التصنيف</h3>
        
        {chartData.length > 0 ? (
          <>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      direction: 'rtl',
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="text-foreground font-medium mr-auto amount">
                    {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
        )}
      </div>

      {/* Payee Totals */}
      <div className="card-elevated p-4">
        <h3 className="font-semibold text-foreground mb-4">المصروفات حسب المستلم</h3>
        
        {payeeTotals.length > 0 ? (
          <div className="space-y-3">
            {payeeTotals.slice(0, 10).map((item, index) => (
              <div
                key={item.payee}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{item.payee}</span>
                </div>
                <span className="font-bold text-foreground amount">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
        )}
      </div>
    </div>
  );
};

export default Reports;

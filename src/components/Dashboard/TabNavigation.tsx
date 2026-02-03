import { List, BarChart3 } from 'lucide-react';

type Tab = 'history' | 'reports';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl">
      <button
        onClick={() => onTabChange('history')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'history'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <List className="w-4 h-4" />
        السجل
      </button>
      <button
        onClick={() => onTabChange('reports')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'reports'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        التقارير
      </button>
    </div>
  );
};

export default TabNavigation;

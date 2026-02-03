export const CATEGORIES = [
  { value: 'groceries', label: 'مسواك' },
  { value: 'household', label: 'أغراض منزل' },
  { value: 'generator', label: 'مولدة' },
  { value: 'internet', label: 'انترنت' },
  { value: 'car', label: 'سيارة' },
  { value: 'debt', label: 'تسديد ديون' },
  { value: 'bills', label: 'فواتير' },
  { value: 'other', label: 'أخرى' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  groceries: '#10B981',
  household: '#8B5CF6',
  generator: '#F59E0B',
  internet: '#3B82F6',
  car: '#EF4444',
  debt: '#EC4899',
  bills: '#6366F1',
  other: '#6B7280',
};

export const getCategoryLabel = (value: string): string => {
  const category = CATEGORIES.find(c => c.value === value);
  return category?.label || value;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' د.ع';
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

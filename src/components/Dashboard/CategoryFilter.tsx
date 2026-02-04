import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  // Filter out 'debt' category since it has its own tab
  const filterCategories = CATEGORIES.filter(cat => cat.value !== 'debt');

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          الكل
        </button>
        {filterCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;

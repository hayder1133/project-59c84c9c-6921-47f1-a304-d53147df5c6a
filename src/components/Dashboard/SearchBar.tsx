import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="بحث بالمحل أو الشخص..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10 h-12 rounded-xl"
      />
    </div>
  );
};

export default SearchBar;

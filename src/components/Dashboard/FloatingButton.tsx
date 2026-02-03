import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="btn-float transition-transform hover:scale-105 active:scale-95"
      aria-label="إضافة مصروف"
    >
      <Plus className="w-7 h-7 text-primary-foreground" />
    </button>
  );
};

export default FloatingButton;

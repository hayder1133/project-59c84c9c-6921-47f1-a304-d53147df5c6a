import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { signOut } = useAuth();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">متتبع المصروفات</h1>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

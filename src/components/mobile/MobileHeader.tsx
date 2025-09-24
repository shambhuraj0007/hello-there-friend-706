import { ArrowLeft, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onSearch?: () => void;
}

export const MobileHeader = ({
  title,
  showBack = false,
  showMenu = false,
  showSearch = false,
  onBack,
  onMenu,
  onSearch,
}: MobileHeaderProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {showMenu && (
            <Button variant="ghost" size="sm" onClick={onMenu}>
             
            </Button>
          )}
        </div>
        
        <h1 className="text-lg font-semibold text-foreground truncate">
          {title}
        </h1>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button variant="ghost" size="sm" onClick={onSearch}>
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
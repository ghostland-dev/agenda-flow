
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Search, X, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from './TaskForm';

interface HeaderProps {
  toggleSidebar: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      onSearch('');
    }
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex items-center gap-2 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />
          <span className="font-bold">TaskFlow</span>
        </Link>
      </div>
      
      <div className={`flex-1 ${showSearch ? 'flex' : 'hidden md:flex'}`}>
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des tâches..."
            className="w-full bg-background pl-8 md:w-80 lg:w-96"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={toggleSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {!showSearch && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="md:hidden"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-1 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-flex">Nouvelle tâche</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <TaskForm />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;

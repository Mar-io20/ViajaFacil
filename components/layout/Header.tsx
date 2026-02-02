import React from 'react';
import { Plane, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onLogoClick: () => void;
  onNavigate: (sectionId: string) => void;
  onDashboardClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLoginClick, 
  onLogout, 
  onLogoClick, 
  onNavigate,
  onDashboardClick 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-40 h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={onLogoClick}
        >
          <div className="bg-primary p-2 rounded-lg group-hover:bg-teal-800 transition-colors">
            <Plane className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tight">
            Viaja<span className="text-primary">Fácil</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <button onClick={() => onNavigate('destinos')} className="hover:text-primary transition-colors">Destinos</button>
          <button onClick={() => onNavigate('pacotes')} className="hover:text-primary transition-colors">Pacotes</button>
          <button onClick={() => onNavigate('sobre')} className="hover:text-primary transition-colors">Sobre Nós</button>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Dashboard Button */}
              <Button 
                variant="secondary" 
                onClick={onDashboardClick}
                className="hidden md:flex shadow-sm"
              >
                <LayoutDashboard size={18} className="mr-2" />
                Meu Painel
              </Button>

              <div className="text-right hidden sm:flex items-center gap-3 border-l border-gray-200 pl-3 ml-2">
                 <div className="flex flex-col items-end">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-primary font-medium">Organizador</p>
                 </div>
                 {user.avatar ? (
                   <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                 ) : (
                   <UserCircle className="text-gray-400 w-9 h-9" />
                 )}
              </div>
              
              <Button variant="ghost" onClick={onLogout} className="text-red-500 hover:bg-red-50" title="Sair">
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={onLoginClick}>
              <UserCircle className="mr-2 h-5 w-5" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
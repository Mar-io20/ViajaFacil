import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { User } from '../../types';
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation of API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: email,
        name: isRegistering ? name : 'Organizador Demo', 
        role: 'ORGANIZER'
      });
      // Reset state on close
      setEmail('');
      setPassword('');
      setName('');
      onClose();
    }, 1000);
  };

  const handleDemoFill = () => {
    setEmail('organizador@viajafacil.com');
    setPassword('senha123');
    if (isRegistering) setName('Organizador Exemplo');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isRegistering ? "Crie sua conta" : "Acesse sua conta"}
    >
      <div className="mb-6">
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              !isRegistering ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              isRegistering ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cadastro
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <div className="space-y-2 animate-fade-in">
            <label className="text-sm font-medium text-gray-700">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                required={isRegistering}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Seu nome"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            {!isRegistering && (
              <button type="button" className="text-xs text-primary hover:underline" onClick={() => alert('Email de recuperação enviado!')}>
                Esqueceu a senha?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full h-11" isLoading={isLoading}>
            {isRegistering ? 'Criar Conta Grátis' : 'Entrar'}
          </Button>
        </div>
        
        <div className="text-center">
          <button 
            type="button" 
            onClick={handleDemoFill}
            className="text-xs text-gray-400 hover:text-primary transition-colors underline decoration-dashed"
          >
            Preencher dados de demonstração
          </button>
        </div>
      </form>
    </Modal>
  );
};
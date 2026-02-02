import React, { useState } from 'react';
import { User, Trip } from '../../types';
import { Plus, Calendar, Map, Wallet, Settings, Users, ArrowRight, Edit2, User as UserIcon, LogIn, Trash2, AlertTriangle, PieChart, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface OrganizerDashboardProps {
  user: User;
  trips: Trip[];
  onEditProfile: () => void;
  onSelectTrip: (trip: Trip) => void;
  onCreateTrip: () => void;
  onJoinTrip: (code: string) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ 
  user, 
  trips, 
  onEditProfile, 
  onSelectTrip, 
  onCreateTrip,
  onJoinTrip,
  onDeleteTrip
}) => {
  const [joinCode, setJoinCode] = useState('');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length === 6) {
      onJoinTrip(joinCode.toUpperCase());
      setJoinCode('');
    } else {
      alert("O código deve ter 6 caracteres.");
    }
  };

  const handleConfirmDelete = () => {
    if (tripToDelete) {
      onDeleteTrip(tripToDelete.id);
      setTripToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                <UserIcon size={32} className="text-gray-400" />
                )}
            </div>
            <div>
                <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name}</h1>
                <button 
                    onClick={onEditProfile}
                    className="text-gray-400 hover:text-primary transition-colors p-1.5 rounded-full hover:bg-gray-50"
                    title="Editar Perfil"
                >
                    <Edit2 size={16} />
                </button>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                Gerencie seus grupos e controle suas finanças de viagem.
                </p>
            </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleJoin} className="flex gap-2">
                    <input 
                    type="text" 
                    placeholder="CÓDIGO" 
                    maxLength={6}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-28 text-center tracking-widest uppercase font-bold text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <Button type="submit" variant="secondary" className="px-4">
                    Entrar
                    </Button>
                </form>
                <Button onClick={onCreateTrip}>
                <Plus size={18} className="mr-2" />
                Nova Viagem
                </Button>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Map size={24} /></div>
          <div>
            <span className="text-gray-500 text-sm font-medium">Viagens Ativas</span>
            <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-lg text-green-600"><Wallet size={24} /></div>
          <div>
            <span className="text-gray-500 text-sm font-medium">Orçamento Total</span>
            <p className="text-2xl font-bold text-gray-900">
                R$ {trips.reduce((acc, t) => acc + t.budget, 0).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><Users size={24} /></div>
          <div>
            <span className="text-gray-500 text-sm font-medium">Total de Membros</span>
            <p className="text-2xl font-bold text-gray-900">
                {trips.reduce((acc, t) => acc + t.members.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Active Trips List - Redesigned as Control Panels */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Painel de Controle
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trips.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma viagem encontrada</h3>
                <p className="text-gray-500 mb-6">Comece planejando sua próxima aventura em grupo.</p>
                <Button onClick={onCreateTrip} variant="outline">Criar meu primeiro grupo</Button>
            </div>
        )}

        {trips.map((trip) => {
            // Calculate Financial Progress
            const progress = trip.budget > 0 ? (trip.spent / trip.budget) * 100 : 0;
            const isOverBudget = progress > 100;
            
            return (
                <div key={trip.id} className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                    {/* Card Header */}
                    <div className="p-6 pb-4 border-b border-gray-50">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit mb-2 ${
                                    trip.status === 'planning' ? 'bg-blue-100 text-blue-700' : 
                                    trip.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {trip.status === 'planning' ? 'Em Planejamento' : trip.status === 'booked' ? 'Confirmado' : 'Concluído'}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">{trip.name}</h3>
                            </div>
                            
                            <div className="flex gap-1">
                                {trip.ownerId === user.id && (
                                <button 
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={() => setTripToDelete(trip)}
                                    title="Excluir Grupo"
                                >
                                    <Trash2 size={18} />
                                </button>
                                )}
                                <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Settings size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} className="text-gray-400" />
                                {trip.dates}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users size={16} className="text-gray-400" />
                                {trip.members.length} viajantes
                            </div>
                        </div>
                    </div>
                    
                    {/* Financial Control Section */}
                    <div className="px-6 py-5 bg-gray-50/50 flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Controle Financeiro</span>
                            <span className={`text-xs font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                                {Math.round(progress)}% do orçamento
                            </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                            <div 
                                className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-primary'}`} 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Gasto: <span className="font-semibold text-gray-900">R$ {trip.spent?.toLocaleString('pt-BR') || '0'}</span>
                            </span>
                            <span className="text-gray-400">/ R$ {trip.budget.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 bg-white mt-auto grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={() => onSelectTrip(trip)} className="justify-center text-sm h-10">
                            <PieChart size={16} className="mr-2" />
                            Gestão
                        </Button>
                        <Button onClick={() => onSelectTrip(trip)} className="justify-center text-sm h-10">
                            Abrir Grupo
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            );
        })}
        
        {/* Add New Quick Action */}
        <button 
            onClick={onCreateTrip}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-teal-50/30 transition-all group min-h-[250px]"
        >
          <div className="bg-white group-hover:bg-white shadow-sm border border-gray-100 p-4 rounded-full mb-3 transition-colors">
            <Plus size={32} className="text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <span className="font-semibold">Criar novo grupo</span>
          <span className="text-xs mt-1 text-gray-400">Comece do zero</span>
        </button>
      </div>

      {tripToDelete && (
        <DeleteConfirmationModal 
          isOpen={!!tripToDelete} 
          onClose={() => setTripToDelete(null)}
          trip={tripToDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onConfirm: () => void;
}> = ({ isOpen, onClose, trip, onConfirm }) => {
  const [confirmationName, setConfirmationName] = useState('');
  
  const isMatch = confirmationName === trip.name;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Grupo de Viagem">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-500 shrink-0" size={24} />
          <div>
            <h4 className="text-red-800 font-bold text-sm">Ação Irreversível</h4>
            <p className="text-red-700 text-sm mt-1">
              Você está prestes a excluir o grupo <strong>{trip.name}</strong>. 
              Isso removerá todos os membros, roteiros e dados financeiros permanentemente.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Para confirmar, digite <strong>{trip.name}</strong> abaixo:
          </label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
            placeholder="Nome do grupo"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button 
            className={`flex-1 ${isMatch ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed hover:bg-gray-300'}`}
            disabled={!isMatch}
            onClick={onConfirm}
          >
            Excluir Permanentemente
          </Button>
        </div>
      </div>
    </Modal>
  );
};
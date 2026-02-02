import React, { useState } from 'react';
import { User, Trip } from '../../types';
import { Plus, Calendar, Map, Wallet, Settings, Users, ArrowRight, Edit2, User as UserIcon, LogIn, Trash2, AlertTriangle } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={32} className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Olá, {user.name}!</h1>
              <button 
                onClick={onEditProfile}
                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100"
                title="Editar Perfil"
              >
                <Edit2 size={18} />
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              {user.phone ? (
                <span className="flex items-center gap-2">
                  <span className="text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">{user.phone}</span>
                  <span className="text-gray-300">|</span>
                  <span>Painel de controle</span>
                </span>
              ) : (
                "Painel de controle das suas viagens em grupo."
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <form onSubmit={handleJoin} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Código do Grupo" 
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-36 text-center tracking-widest uppercase font-bold text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <Button type="submit" variant="secondary" className="px-3">
                  <LogIn size={18} />
                </Button>
            </form>
            <Button onClick={onCreateTrip}>
              <Plus size={20} className="mr-2" />
              Nova Viagem
            </Button>
        </div>
      </div>

      {/* Stats Cards - Static for now, could be dynamic based on trips */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Viagens Ativas</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Map size={20} /></div>
          </div>
          <span className="text-2xl font-bold">{trips.length}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Orçamento Total</span>
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Wallet size={20} /></div>
          </div>
          <span className="text-2xl font-bold">R$ {trips.reduce((acc, t) => acc + t.budget, 0).toLocaleString('pt-BR')}</span>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Próxima Atividade</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Calendar size={20} /></div>
          </div>
          <span className="text-lg font-medium text-gray-800">Check-in Voo 3421 - Amanhã 14:00</span>
        </div>
      </div>

      {/* Active Trips List */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Minhas Viagens</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trips.length === 0 && (
            <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-4">Você ainda não tem viagens.</p>
                <Button onClick={onCreateTrip} variant="outline">Criar meu primeiro grupo</Button>
            </div>
        )}

        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                  trip.status === 'planning' ? 'bg-blue-100 text-blue-700' : 
                  trip.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {trip.status === 'planning' ? 'Planejamento' : trip.status === 'booked' ? 'Confirmado' : 'Concluído'}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{trip.name}</h3>
                {trip.ownerId === user.id && <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded ml-2">Líder</span>}
              </div>
              
              <div className="flex gap-1">
                {/* Only Show Delete for Leader */}
                {trip.ownerId === user.id && (
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => setTripToDelete(trip)}
                    title="Excluir Grupo"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
                <Button variant="ghost" className="text-gray-400">
                  <Settings size={20} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar size={16} className="mr-2 text-primary" />
                {trip.dates}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Users size={16} className="mr-2 text-primary" />
                {trip.members.length} membros
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" variant="outline" onClick={() => onSelectTrip(trip)}>Gerenciar Roteiro</Button>
              <Button className="flex-1" onClick={() => onSelectTrip(trip)}>
                Ver Detalhes <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Add New Placeholder */}
        <button 
            onClick={onCreateTrip}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-teal-50 transition-all group min-h-[200px]"
        >
          <div className="bg-gray-50 group-hover:bg-white p-4 rounded-full mb-3 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-medium">Criar novo grupo de viagem</span>
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
              Isso removerá todos os membros, roteiros e anexos permanentemente.
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
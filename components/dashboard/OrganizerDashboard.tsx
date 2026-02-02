import React from 'react';
import { User, Trip } from '../../types';
import { Plus, Calendar, Map, Wallet, Settings, Users, ArrowRight, Edit2, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface OrganizerDashboardProps {
  user: User;
  onEditProfile: () => void;
}

const MOCK_TRIPS: Trip[] = [
  { id: '1', name: 'Eurotrip com a Galera', dates: '10 - 25 Out, 2024', status: 'planning', budget: 15000 },
  { id: '2', name: 'Fim de Ano na Praia', dates: '28 Dez - 03 Jan, 2025', status: 'booked', budget: 3500 },
];

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ user, onEditProfile }) => {
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
        <Button>
          <Plus size={20} className="mr-2" />
          Nova Viagem
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Em Planejamento</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Map size={20} /></div>
          </div>
          <span className="text-2xl font-bold">1</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Confirmadas</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><Calendar size={20} /></div>
          </div>
          <span className="text-2xl font-bold">1</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Orçamento Total</span>
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Wallet size={20} /></div>
          </div>
          <span className="text-2xl font-bold">R$ 18.500</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Viajantes</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Users size={20} /></div>
          </div>
          <span className="text-2xl font-bold">8</span>
        </div>
      </div>

      {/* Active Trips List */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Minhas Viagens</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_TRIPS.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                  trip.status === 'planning' ? 'bg-blue-100 text-blue-700' : 
                  trip.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {trip.status === 'planning' ? 'Planejamento' : trip.status === 'booked' ? 'Confirmado' : 'Concluído'}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{trip.name}</h3>
              </div>
              <Button variant="ghost" className="text-gray-400">
                <Settings size={20} />
              </Button>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar size={16} className="mr-2 text-primary" />
                {trip.dates}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Wallet size={16} className="mr-2 text-primary" />
                Orçamento Est.: R$ {trip.budget.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" variant="outline">Gerenciar Itinerário</Button>
              <Button className="flex-1">
                Ver Detalhes <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Add New Placeholder */}
        <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-teal-50 transition-all group min-h-[200px]">
          <div className="bg-gray-50 group-hover:bg-white p-4 rounded-full mb-3 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-medium">Criar novo grupo de viagem</span>
        </button>
      </div>
    </div>
  );
};
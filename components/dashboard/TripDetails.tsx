import React, { useState, useRef } from 'react';
import { Trip, ItineraryItem, User, ItineraryType, Member } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { uploadFile } from '../../services/storageService';
import { 
  Calendar, MapPin, Plane, Car, Home, 
  Users, Plus, Trash2, FileText, Upload, 
  Shield, ShieldAlert, Copy, Check, Settings as SettingsIcon, 
  MoreVertical, UserMinus, UserCheck, Crown, UserCog, Mail, Edit2, Save
} from 'lucide-react';

interface TripDetailsProps {
  trip: Trip;
  currentUser: User;
  onBack: () => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, currentUser, onBack, onUpdateTrip }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'members'>('itinerary');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Check permissions
  const isLeader = trip.ownerId === currentUser.id;
  const currentMember = trip.members.find(m => m.userId === currentUser.id);
  const isCoordinator = currentMember?.role === 'COORDINATOR';
  // Leader and Coordinator can edit itinerary/details
  const canEdit = isLeader || isCoordinator || currentMember?.canEdit;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trip.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // --- Member Management Logic ---

  const handleUpdateMemberRole = (memberId: string, newRole: 'COORDINATOR' | 'MEMBER') => {
    if (!isLeader) return;
    
    const updatedMembers = trip.members.map(m => {
      if (m.userId === memberId) {
        return { 
          ...m, 
          role: newRole,
          canEdit: newRole === 'COORDINATOR' ? true : false 
        };
      }
      return m;
    });

    onUpdateTrip({ ...trip, members: updatedMembers });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!isLeader) return;
    if (confirm("Tem certeza que deseja remover este membro do grupo?")) {
      const updatedMembers = trip.members.filter(m => m.userId !== memberId);
      onUpdateTrip({ ...trip, members: updatedMembers });
    }
  };

  const handleAddMember = (name: string, email: string) => {
      const newMember: Member = {
          userId: `manual-${Date.now()}`,
          name: name,
          email: email,
          role: 'MEMBER',
          canEdit: false,
          avatar: ''
      };
      onUpdateTrip({ ...trip, members: [...trip.members, newMember] });
      setIsAddMemberOpen(false);
  };

  const handleEditMemberName = (memberId: string, newName: string) => {
    const updatedMembers = trip.members.map(m => 
        m.userId === memberId ? { ...m, name: newName } : m
    );
    onUpdateTrip({ ...trip, members: updatedMembers });
    setEditingMemberId(null);
  };

  // --- Itinerary Logic ---

  const handleDeleteItem = (itemId: string) => {
    if (!canEdit) return;
    const updatedItinerary = trip.itinerary.filter(i => i.id !== itemId);
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleAddItem = (item: ItineraryItem) => {
    onUpdateTrip({
      ...trip,
      itinerary: [...trip.itinerary, item]
    });
    setIsAddItemOpen(false);
  };

  const handleUpdateTripDetails = (name: string, dates: string, budget: number) => {
      onUpdateTrip({
          ...trip,
          name,
          dates,
          budget
      });
      setIsEditTripOpen(false);
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 animate-fade-in">
      {/* Header */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={onBack} className="text-gray-500 hover:text-primary mb-4 flex items-center gap-1 text-sm font-medium">
          ← Voltar para painel
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                    <Calendar size={16} className="text-primary" /> {trip.dates}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                    <span className="font-semibold text-green-600">R$</span> {trip.budget.toLocaleString('pt-BR')}
                </span>
                <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-mono border border-blue-100">
                    {trip.code}
                    <button onClick={handleCopyCode} className="hover:text-blue-900 ml-1">
                        {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isLeader && (
                <Button variant="outline" onClick={() => setIsEditTripOpen(true)}>
                    <SettingsIcon size={18} className="mr-2" />
                    Configurações
                </Button>
            )}
            {canEdit && activeTab === 'itinerary' && (
                <Button onClick={() => setIsAddItemOpen(true)}>
                <Plus size={20} className="mr-2" />
                Adicionar Item
                </Button>
            )}
             {isLeader && activeTab === 'members' && (
                <Button onClick={() => setIsAddMemberOpen(true)}>
                <Plus size={20} className="mr-2" />
                Adicionar Viajante
                </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-8">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`pb-3 font-medium text-sm transition-colors border-b-2 px-2 ${
            activeTab === 'itinerary' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Roteiro & Reservas
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 font-medium text-sm transition-colors border-b-2 px-2 ${
            activeTab === 'members' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Lista de Viajantes ({trip.members.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'itinerary' ? (
        <div className="space-y-4">
          {trip.itinerary.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">O roteiro está vazio.</p>
              <p className="text-sm text-gray-400 mb-4">Comece adicionando voos, hotéis ou passeios.</p>
              {canEdit && <Button variant="outline" onClick={() => setIsAddItemOpen(true)}>Criar Roteiro</Button>}
            </div>
          ) : (
            trip.itinerary.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 relative group">
                {/* Left Border Color Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                  item.type === 'FLIGHT' ? 'bg-blue-500' :
                  item.type === 'STAY' ? 'bg-purple-500' :
                  item.type === 'CAR' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>

                <div className="flex-1 pl-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                             <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                item.type === 'FLIGHT' ? 'bg-blue-100 text-blue-700' :
                                item.type === 'STAY' ? 'bg-purple-100 text-purple-700' :
                                item.type === 'CAR' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                             }`}>
                                {item.type === 'FLIGHT' ? 'Voo' : item.type === 'STAY' ? 'Hospedagem' : item.type === 'CAR' ? 'Transporte' : 'Atividade'}
                             </span>
                             <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        </div>
                        {canEdit && (
                            <button onClick={() => handleDeleteItem(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {item.date.replace('T', ' ')}
                        </div>
                        {item.details.provider && (
                            <div className="font-medium text-gray-800">
                                {item.details.provider}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                         {item.details.flightNumber && <p><span className="text-gray-400 mr-2">Voo:</span> {item.details.flightNumber}</p>}
                         {item.details.seat && <p><span className="text-gray-400 mr-2">Assento:</span> {item.details.seat}</p>}
                         {item.details.location && <p><span className="text-gray-400 mr-2">Local:</span> {item.details.location}</p>}
                         {item.details.carModel && <p><span className="text-gray-400 mr-2">Veículo:</span> {item.details.carModel}</p>}
                    </div>

                    {item.attachments && item.attachments.length > 0 && (
                        <div className="mt-4 flex gap-2 overflow-x-auto">
                        {item.attachments.map((att, idx) => (
                            <a 
                            key={idx} 
                            href={att.url} 
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm"
                            >
                            <FileText size={14} />
                            {att.name}
                            </a>
                        ))}
                        </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="p-4 pl-6">Viajante</th>
                  <th className="p-4 hidden sm:table-cell">Contato</th>
                  <th className="p-4">Permissões</th>
                  <th className="p-4 text-right pr-6">Gerenciar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trip.members.map((member) => (
                  <tr key={member.userId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users size={18} className="text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-[150px]">
                            {editingMemberId === member.userId ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        defaultValue={member.name}
                                        className="w-full p-1 border border-primary rounded text-sm outline-none"
                                        onBlur={(e) => handleEditMemberName(member.userId, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleEditMemberName(member.userId, e.currentTarget.value);
                                        }}
                                    />
                                    <Save size={14} className="text-green-600" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group">
                                    <span className="font-semibold text-gray-900">{member.name}</span>
                                    {isLeader && (
                                        <button 
                                            onClick={() => setEditingMemberId(member.userId)} 
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity"
                                            title="Renomear"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                    )}
                                </div>
                            )}
                            <span className="text-xs text-gray-500 md:hidden flex items-center gap-1 mt-0.5">
                                {member.role === 'LEADER' && <Crown size={10} className="text-purple-500" />}
                                {member.role === 'LEADER' ? 'Líder' : member.role === 'COORDINATOR' ? 'Coordenador' : 'Membro'}
                            </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-sm text-gray-600">
                         {member.email ? (
                             <div className="flex items-center gap-2">
                                 <Mail size={14} className="text-gray-400" />
                                 {member.email}
                             </div>
                         ) : (
                             <span className="text-gray-400 italic text-xs">Sem email cadastrado</span>
                         )}
                    </td>
                    <td className="p-4">
                      {member.role === 'LEADER' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          <Crown size={12} className="mr-1.5" /> ORGANIZADOR
                        </span>
                      ) : member.role === 'COORDINATOR' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          <UserCog size={12} className="mr-1.5" /> COORDENADOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          VIAJANTE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      {isLeader && member.role !== 'LEADER' ? (
                        <div className="flex justify-end gap-2">
                            {member.role !== 'COORDINATOR' ? (
                                <button
                                    onClick={() => handleUpdateMemberRole(member.userId, 'COORDINATOR')}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Promover a Coordenador"
                                >
                                    <Shield size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpdateMemberRole(member.userId, 'MEMBER')}
                                    className="p-2 text-blue-600 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Rebaixar a Membro"
                                >
                                    <ShieldAlert size={18} />
                                </button>
                            )}
                            
                            <button
                                onClick={() => handleRemoveMember(member.userId)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remover do Grupo"
                            >
                                <UserMinus size={18} />
                            </button>
                        </div>
                      ) : (
                         <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddItemOpen && (
        <AddItemModal 
          isOpen={isAddItemOpen} 
          onClose={() => setIsAddItemOpen(false)} 
          onSave={handleAddItem} 
        />
      )}

      {isEditTripOpen && (
          <EditTripModal
            isOpen={isEditTripOpen}
            onClose={() => setIsEditTripOpen(false)}
            currentTrip={trip}
            onSave={handleUpdateTripDetails}
          />
      )}

      {isAddMemberOpen && (
          <AddMemberModal
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onAdd={handleAddMember}
          />
      )}
    </div>
  );
};

// Sub-component for Editing Trip Details
const EditTripModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    currentTrip: Trip; 
    onSave: (name: string, dates: string, budget: number) => void 
}> = ({ isOpen, onClose, currentTrip, onSave }) => {
    const [name, setName] = useState(currentTrip.name);
    const [dates, setDates] = useState(currentTrip.dates);
    const [budget, setBudget] = useState(currentTrip.budget);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name, dates, budget);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configurações da Viagem">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nome da Viagem</label>
                    <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Datas</label>
                    <input 
                        type="text" 
                        required 
                        value={dates} 
                        onChange={e => setDates(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="Ex: 10 a 20 de Outubro"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Orçamento Estimado (R$)</label>
                    <input 
                        type="number" 
                        value={budget} 
                        onChange={e => setBudget(Number(e.target.value))} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none" 
                    />
                </div>
                <div className="pt-4 border-t border-gray-100 flex gap-3">
                    <Button variant="ghost" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
                    <Button type="submit" className="flex-1">Salvar Alterações</Button>
                </div>
            </form>
        </Modal>
    );
}

// Sub-component for Adding Member Manually
const AddMemberModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, email: string) => void;
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(name, email);
        setName('');
        setEmail('');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Viajante Manualmente">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                Use isso para adicionar pessoas que não têm acesso ao aplicativo ou crianças.
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nome Completo</label>
                    <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="Ex: Maria Silva"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email (Opcional)</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="email@exemplo.com"
                    />
                </div>
                <div className="pt-2 flex gap-3">
                    <Button variant="ghost" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
                    <Button type="submit" className="flex-1">Adicionar</Button>
                </div>
            </form>
        </Modal>
    )
}

// Sub-component for Adding Items
const AddItemModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (item: ItineraryItem) => void }> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<ItineraryType>('FLIGHT');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  // Details
  const [provider, setProvider] = useState('');
  const [location, setLocation] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [seat, setSeat] = useState('');
  // File
  const [attachment, setAttachment] = useState<{name: string, url: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file);
        setAttachment({ name: file.name, url });
      } catch (err) {
        alert("Erro no upload");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      type,
      title,
      date,
      details: {
        provider,
        location,
        flightNumber,
        seat,
      },
      attachments: attachment ? [{ ...attachment, type: 'BOARDING_PASS' }] : []
    };
    onSave(newItem);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar ao Roteiro">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
          {(['FLIGHT', 'STAY', 'CAR'] as ItineraryType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 text-xs font-bold rounded-md transition-all ${
                type === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
              }`}
            >
              {t === 'FLIGHT' ? 'VOO' : t === 'STAY' ? 'HOSPEDAGEM' : 'CARRO'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Título</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder={type === 'FLIGHT' ? 'Voo para Paris' : 'Hotel Central'} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Data</label>
          <input required type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{type === 'FLIGHT' ? 'Companhia Aérea' : type === 'STAY' ? 'Nome do Hotel/Casa' : 'Locadora'}</label>
          <input type="text" value={provider} onChange={e => setProvider(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        {type === 'FLIGHT' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nº Voo</label>
              <input type="text" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Assento</label>
              <input type="text" value={seat} onChange={e => setSeat(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        )}

        {(type === 'STAY' || type === 'CAR') && (
           <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Localização / Detalhes</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        )}

        {/* Attachment Section */}
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            {type === 'FLIGHT' ? 'Cartão de Embarque' : 'Voucher / Comprovante'}
          </label>
          
          {attachment ? (
            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-lg">
              <span className="text-xs text-green-700 truncate max-w-[200px]">{attachment.name}</span>
              <button type="button" onClick={() => setAttachment(null)} className="text-xs text-red-500 hover:underline">Remover</button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload size={20} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">{isUploading ? 'Enviando...' : 'Clique para enviar arquivo'}</span>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isUploading}>
          Adicionar Item
        </Button>
      </form>
    </Modal>
  )
}
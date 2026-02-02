import React, { useState } from 'react';
import { Plane, Bus, Car, Home, Search, Calendar, MapPin, Users } from 'lucide-react';
import { SearchType, SearchParams } from '../../types';
import { SearchTab } from './SearchTab';
import { Button } from '../ui/Button';

interface SearchWidgetProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<SearchType>(SearchType.FLIGHT);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: activeTab,
      origin: activeTab === SearchType.CAR || activeTab === SearchType.STAY ? undefined : origin,
      destination,
      date,
      passengers
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto -mt-24 relative z-20 border border-gray-100">
      {/* Tabs */}
      <div className="flex flex-wrap md:flex-nowrap border-b border-gray-100 bg-gray-50/50">
        <SearchTab 
          type={SearchType.FLIGHT} 
          isActive={activeTab === SearchType.FLIGHT} 
          onClick={setActiveTab} 
          icon={<Plane size={20} />} 
          label="Voos" 
        />
        <SearchTab 
          type={SearchType.BUS} 
          isActive={activeTab === SearchType.BUS} 
          onClick={setActiveTab} 
          icon={<Bus size={20} />} 
          label="Ônibus" 
        />
        <SearchTab 
          type={SearchType.CAR} 
          isActive={activeTab === SearchType.CAR} 
          onClick={setActiveTab} 
          icon={<Car size={20} />} 
          label="Carros" 
        />
        <SearchTab 
          type={SearchType.STAY} 
          isActive={activeTab === SearchType.STAY} 
          onClick={setActiveTab} 
          icon={<Home size={20} />} 
          label="Hospedagem" 
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Origin - Conditional */}
        {(activeTab === SearchType.FLIGHT || activeTab === SearchType.BUS) && (
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Origem</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="De onde?"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Destination */}
        <div className={`${(activeTab === SearchType.FLIGHT || activeTab === SearchType.BUS) ? 'md:col-span-3' : 'md:col-span-4'}`}>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            {activeTab === SearchType.CAR ? 'Local de Retirada' : 'Destino'}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Para onde?"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Date */}
        <div className={`${(activeTab === SearchType.FLIGHT || activeTab === SearchType.BUS) ? 'md:col-span-3' : 'md:col-span-3'}`}>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Data</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-600"
            />
          </div>
        </div>

        {/* Passengers / Guests */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            {activeTab === SearchType.STAY ? 'Hóspedes' : 'Viajantes'}
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="number"
              min="1"
              max="20"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className={`${(activeTab === SearchType.FLIGHT || activeTab === SearchType.BUS) ? 'md:col-span-1' : 'md:col-span-3'} flex justify-end`}>
          <Button type="submit" className="w-full h-[46px]" variant="secondary">
            <Search className="md:mr-0 lg:mr-2" size={20} />
            <span className="hidden lg:inline">Pesquisar</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
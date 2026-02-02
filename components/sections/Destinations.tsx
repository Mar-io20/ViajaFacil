import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const DESTINATIONS = [
  {
    id: 1,
    name: 'Jericoacoara, CE',
    image: 'https://images.unsplash.com/photo-1571235479262-1279a1f24d43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Paraíso de dunas e lagoas cristalinas.'
  },
  {
    id: 2,
    name: 'Paris, França',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A cidade luz espera pelo seu grupo.'
  },
  {
    id: 3,
    name: 'Cancún, México',
    image: 'https://images.unsplash.com/photo-1552074291-ad4dfd8b11c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Praias caribenhas e resorts all-inclusive.'
  },
  {
    id: 4,
    name: 'Gramado, RS',
    image: 'https://images.unsplash.com/photo-1629906649237-750530d43717?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Charme europeu no sul do Brasil.'
  }
];

export const Destinations: React.FC = () => {
  return (
    <section id="destinos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Destinos em Alta</h2>
            <p className="text-gray-600">Os lugares mais procurados por grupos neste mês.</p>
          </div>
          <button className="hidden md:flex items-center text-primary font-semibold hover:text-teal-800 transition-colors">
            Ver todos os destinos <ArrowRight size={20} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div key={dest.id} className="group relative rounded-2xl overflow-hidden shadow-lg h-80 cursor-pointer">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <MapPin size={18} className="text-accent" />
                    {dest.name}
                  </h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
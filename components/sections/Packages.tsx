import React from 'react';
import { Check, Calendar, Users } from 'lucide-react';
import { Button } from '../ui/Button';

const PACKAGES = [
  {
    id: 1,
    title: 'Eurotrip Clássica',
    places: 'Londres, Paris e Roma',
    duration: '12 Dias',
    price: 'R$ 12.400',
    features: ['Aéreo Incluso', 'Hotéis 4 Estrelas', 'Guia em Português', 'Café da Manhã'],
    tag: 'Mais Vendido'
  },
  {
    id: 2,
    title: 'Expedição Patagônia',
    places: 'Ushuaia e El Calafate',
    duration: '8 Dias',
    price: 'R$ 6.800',
    features: ['Passeios de Barco', 'Hospedagem Charmosa', 'Traslados', 'Seguro Viagem'],
    tag: 'Aventura'
  },
  {
    id: 3,
    title: 'Resort Nordeste',
    places: 'Porto de Galinhas',
    duration: '7 Dias',
    price: 'R$ 3.200',
    features: ['All Inclusive', 'Voo Direto', 'Beira-mar', 'Kids Club'],
    tag: 'Família'
  }
];

export const Packages: React.FC = () => {
  return (
    <section id="pacotes" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pacotes Exclusivos para Grupos</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Roteiros pensados para facilitar a logística de quem viaja junto. Tudo pronto, é só embarcar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative bg-white hover:-translate-y-1">
              {pkg.tag && (
                <span className="absolute top-4 right-4 bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {pkg.tag}
                </span>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
              <p className="text-gray-500 font-medium mb-4">{pkg.places}</p>
              
              <div className="flex gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                  <Calendar size={16} className="text-primary" />
                  {pkg.duration}
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                  <Users size={16} className="text-primary" />
                  Grupo Mín. 4
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-600 text-sm">
                    <Check size={16} className="text-green-500 mr-2 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="mb-4">
                  <span className="text-xs text-gray-400 block">A partir de</span>
                  <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-xs text-gray-400"> / pessoa</span>
                </div>
                <Button className="w-full" variant="outline" onClick={() => alert("Solicite uma cotação personalizada no topo da página!")}>
                  Ver Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
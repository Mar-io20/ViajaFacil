import React from 'react';
import { SearchParams, SearchType } from '../../types';
import { MessageCircle, Phone, CheckCircle, Clock, DollarSign, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConsultantRecommendationProps {
  params: SearchParams;
  onContactClick: () => void;
}

export const ConsultantRecommendation: React.FC<ConsultantRecommendationProps> = ({ params, onContactClick }) => {
  const getSearchTypeLabel = (type: SearchType) => {
    switch (type) {
      case SearchType.FLIGHT: return 'Passagens Aéreas';
      case SearchType.BUS: return 'Passagens de Ônibus';
      case SearchType.CAR: return 'Aluguel de Carros';
      case SearchType.STAY: return 'Hospedagem';
      default: return 'Viagem';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Left Side: Consultant Profile */}
        <div className="bg-primary/5 p-8 md:w-2/5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Consultora de Viagens" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1.5 rounded-full shadow-sm border-2 border-white">
              <CheckCircle size={16} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Mariana Costa</h3>
          <p className="text-primary font-medium mb-4">Especialista em Grupos</p>
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-white px-3 py-1 rounded-full shadow-sm">
            <Star size={14} fill="currentColor" />
            <span>4.9</span>
            <span className="text-gray-400 font-normal ml-1">(120+ avaliações)</span>
          </div>
        </div>

        {/* Right Side: Offer Details */}
        <div className="p-8 md:w-3/5 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide mb-4 self-start">
            Serviço 100% Gratuito
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Encontramos um especialista para sua busca!
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Olá! Vi que você está planejando <strong>{getSearchTypeLabel(params.type)}</strong> para <strong>{params.destination}</strong>. 
            Em vez de algoritmos genéricos, eu mesma farei uma cotação personalizada para o seu grupo.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="text-primary" size={20} />
              <span>Resposta rápida em até 30 minutos</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <DollarSign className="text-primary" size={20} />
              <span>Garantia de menor preço negociado</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-primary" size={20} />
              <span>Sem taxas ocultas ou compromisso</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onContactClick} className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg">
              <MessageCircle className="mr-2" />
              Chamar no WhatsApp
            </Button>
            <Button variant="outline" className="flex-1 h-12">
              <Phone className="mr-2" />
              Ligar Agora
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            Ao clicar, você será redirecionado para o atendimento oficial.
          </p>
        </div>
      </div>
    </div>
  );
};
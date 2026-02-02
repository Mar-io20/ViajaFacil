import React from 'react';
import { SearchResultItem } from '../../types';
import { Star, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ResultsListProps {
  results: SearchResultItem[];
  isLoading: boolean;
  onSelect: (item: SearchResultItem) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ results, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse flex gap-4">
              <div className="w-32 h-32 bg-gray-200 rounded-lg shrink-0"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-24 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-6 animate-pulse">A IA do ViajaFácil está encontrando as melhores opções para você...</p>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Melhores opções encontradas</h2>
      <div className="grid gap-6">
        {results.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-6">
             {/* Simulating an image for the item based on ID or random */}
            <div className="w-full md:w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative shrink-0">
               <img 
                 src={`https://picsum.photos/seed/${item.id}/200/200`} 
                 alt={item.title}
                 className="w-full h-full object-cover"
               />
               {item.rating && (
                 <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold flex items-center shadow-sm">
                   <Star size={12} className="text-yellow-400 mr-1 fill-current" />
                   {item.rating}
                 </div>
               )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.features.map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                      <Check size={12} className="mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button onClick={() => onSelect(item)} className="w-full md:w-auto">
                  Selecionar e Adicionar ao Roteiro
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
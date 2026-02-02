import React from 'react';
import { SearchType } from '../../types';

interface SearchTabProps {
  type: SearchType;
  isActive: boolean;
  onClick: (type: SearchType) => void;
  icon: React.ReactNode;
  label: string;
}

export const SearchTab: React.FC<SearchTabProps> = ({ type, isActive, onClick, icon, label }) => {
  return (
    <button
      onClick={() => onClick(type)}
      className={`flex flex-col md:flex-row items-center gap-2 px-6 py-4 transition-all duration-300 relative overflow-hidden ${
        isActive 
          ? 'text-primary bg-white shadow-sm font-bold border-b-2 border-primary md:border-b-0' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
        {icon}
      </div>
      <span>{label}</span>
      {isActive && (
        <span className="absolute top-0 left-0 w-full h-1 bg-primary md:hidden" />
      )}
    </button>
  );
};